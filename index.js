var durableJsonLint = require('durable-json-lint'),
    needle = require('needle'),

    stream = require('stream');

var HOST = 'http://www.omdbapi.com/',
    TYPES = [ 'movie', 'series', 'episode' ];

// Series have a different format to describe years, so account for that
// when we format it. For example,
// "1989" == 1998
// "1989-" == { from: 1989, to: undefined }
// "1989-2014" == { from: 1989, to: 2014 }
function formatYear(year) {
    var from, to;

    year = year.split('–');

    if (year.length === 2) {
        from = +year[0];

        if (year[1]) {
            to = +year[1];
        }

        return { from: from, to: to };
    }

    return +year;
}

// Search for movies by titles.
module.exports.search = function (terms, done) {
    var query = {};

    if (typeof terms === 'string') {
        query.s = terms;
    } else {
        query.s = terms.terms || terms.s;
        query.y = terms.year || terms.y;
        query.type = terms.type;
    }

    if (!query.s) {
        return done(new Error('No search terms specified.'));
    }

    if (query.type) {
        if (TYPES.indexOf(query.type) < 0) {
            return done(new Error(
                'Invalid type specified. Valid types are: ' + TYPES.join(', ') +
                '.'
            ));
        }
    }

    if (query.y) {
        query.y = parseInt(query.y, 10);

        if (isNaN(query.y)) {
            return done(new Error('Year is not an integer.'));
        }
    }

    needle.request('get', HOST, query, function (err, res, movies) {
        if (err) {
            return done(err);
        }

        if (res.statusCode !== 200) {
            return done(new Error('status code: ' + res.statusCode));
        }

        // If no movies are found, the API returns
        // "{"Response":"False","Error":"Movie not found!"}" instead of an
        // empty array. So in this case, return an empty array to be consistent.
        if (movies.Response === 'False') {
            return done(null, []);
        }

        // Fix the ugly capitalized naming and cast the year as a Number.
        done(null, movies.Search.map(function (movie) {
            return {
                title: movie.Title,
                year: formatYear(movie.Year),
                imdb: movie.imdbID,
                type: movie.Type
            };
        }));
    });
};

// Find a movie by title, title & year or IMDB ID. The second argument is
// optional and determines whether or not to return an extended plot synopsis.
module.exports.get = (function () {
    var formatRuntime, formatVotes;

    // Format strings of hours & minutes into minutes. For example,
    // "1 h 30 min" == 90.
    formatRuntime = function (runtime) {
        var hours = runtime.match(/(\d+) h/),
            minutes = runtime.match(/(\d+) min/);

        hours = hours ? hours[1] : 0;
        minutes = minutes ? +minutes[1] : 0;

        return (hours * 60) + minutes;
    };

    // Strip foreign characters from the string and return a casted Number.
    formatVotes = function (votes) {
        return +votes.match(/\d/g).join('');
    };

    return function (show, fullPlot, done) {
        var query = {};

        // If the third argument is omitted, treat the second argument as the
        // callback.
        if (!done) {
            done = fullPlot;
            fullPlot = false;
        }

        query.plot = fullPlot ? 'full' : 'short';

        // Select query based on explicit IMDB ID, explicit title, title & year,
        // IMDB ID and title, respectively.
        if (show.imdb) {
            query.i = show.imdb;
        } else if (show.title) {
            query.t = show.title;

            // In order to search with a year, a title must be present.
            if (show.year) {
                query.y = show.year;
            }

        // Assume anything beginning with "tt" and ending with digits is an
        // IMDB ID.
        } else if (/^tt\d+$/.test(show)) {
            query.i = show;

        // Finally, assume options is a string repesenting the title.
        } else {
            query.t = show;
        }

        needle.request('get', HOST, query, function (err, res, movie) {
            if (err) {
                return done(err);
            }

            if (res.statusCode !== 200) {
                return done(new Error('status code: ' + res.statusCode));
            }

            // Needle was unable to parse the JSON. Try durable-json-lint.
            if (typeof movie === 'string') {
                try {
                    movie = JSON.parse(durableJsonLint(movie).json);
                } catch (e) {
                    return done(new Error('Malformed JSON.'));
                }
            }

            // The movie being searched for could not be found.
            if (movie.Response === 'False') {
                return done(null, null);
            }

            // Replace 'N/A' strings with null for simple checks in the return
            // value.
            Object.keys(movie).forEach(function (key) {
                if (movie[key] === 'N/A') {
                    movie[key] = null;
                }
            });

            // Beautify and normalize the ugly results the API returns.
            done(null, {
                title: movie.Title,
                year: formatYear(movie.Year),
                rated: movie.Rated,

                // Cast the API's release date as a native JavaScript Date type.
                released: movie.Released ? new Date(movie.Released) : null,

                // Return runtime as minutes casted as a Number instead of an
                // arbitrary string.
                runtime: movie.Runtime ? formatRuntime(movie.Runtime) : null,

                countries: movie.Country ? movie.Country.split(', ') : null,
                genres: movie.Genre ? movie.Genre.split(', ') : null,
                director: movie.Director,
                writers: movie.Writer ? movie.Writer.split(', ') : null,
                actors: movie.Actors ? movie.Actors.split(', ') : null,
                plot: movie.Plot,

                // A hotlink to a JPG of the movie poster on IMDB.
                poster: movie.Poster,

                imdb: {
                    id: movie.imdbID,
                    rating: movie.imdbRating ? +movie.imdbRating : null,

                    // Convert votes from a US formatted string of a number to
                    // a JavaScript Number.
                    votes: movie.imdbVotes ? formatVotes(movie.imdbVotes) : null
                },

                metacritic: movie.Metascore ? +movie.Metascore : null,

                awards: movie.Awards ? movie.Awards : "",

                type: movie.Type
            });
        });
    };
}());

// Get a Readable Stream with the jpg image data of the poster to the movie,
// identified by title, title & year or IMDB ID.
module.exports.poster = function (show) {
    var out = new stream.PassThrough(),
        req;

    module.exports.get(show, false, function (err, res) {
        if (err) {
            out.emit('error', err);
        } else if (!res) {
            out.emit('error', new Error('Movie not found'));
        } else {
            req = needle.get(res.poster);

            req.on('error', function (err) {
                out.emit('error', err);
            });

            req.pipe(out);
        }
    });

    return out;
};

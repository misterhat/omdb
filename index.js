
var stream = require('stream'),
    request = require('request'),
    host = 'http://www.omdbapi.com/';

// Search for movies by titles.
module.exports.search = function(terms, done) {
    request({
        url: host,
        qs: { s: terms }
    }, function(err, res, body) {
        var movies;

        if(err) {
            return done(err);
        }

        if(res.statusCode !== 200) {
            return done(new Error(res.statusCode));
        }

        try {
            movies = JSON.parse(body);
        } catch(e) {
            return done(e);
        }

        // If no movies are found, the API returns
        // "{"Response":"False","Error":"Movie not found!"}" instead of an
        // empty array. So in this case, return an empty array to be consistent.
        if(movies.Response === 'False') {
            return done(null, []);
        }

        // Fix the ugly capitalized naming and cast the year as a Number.
        done(null, movies.Search.map(function(movie) {
            return {
                title: movie.Title,
                year: +movie.Year,
                imdb: movie.imdbID,
                type: movie.Type
            };
        }));
    });
};

// Get a Readable Stream with the jpg image data of the poster to the movie,
// identified by title, title&year or IMDB ID.
module.exports.poster = function (options) {
    
    var out = new stream.PassThrough;
    
    module.exports.get(options, false, function (err, res) {
        if (err) {
            out.emit('error', err);
        } else if (res === null) {
            out.emit('error', new Error('Movie not found'));
        } else {
            var req = request(res.poster);
            req.on('error', function (err) {
                output.emit('error', err);
            });
            req.pipe(out);
        }
    });
    
    return out;
};

// Find a movie by title, title & year or IMDB ID. The second argument is
// optional and determines whether or not to return an extended plot synopsis.
module.exports.get = (function() {
    var formatRuntime, formatVotes;

    // Format strings of hours & minutes into minutes. For example,
    // "1 h 30 min" == 90.
    formatRuntime = function(runtime) {
        var hours = runtime.match(/(\d+) h/),
            minutes = runtime.match(/(\d+) min/);

        hours = hours ? hours[1] : 0;
        minutes = minutes ? +minutes[1] : 0;

        return (hours * 60) + minutes;
    };

    // Strip foreign characters from the string and return a casted Number.
    formatVotes = function(votes) {
        return +votes.match(/\d/g).join('');
    };

    return function(options, fullPlot, done) {
        var query = {};

        // If the third argument is omitted, treat the second argument as the
        // callback.
        if(!done) {
            done = fullPlot;
            fullPlot = false;
        }

        query.plot = fullPlot ? 'full' : 'short';

        // Select query based on explicit IMDB ID, explicit title, title & year,
        // IMDB ID and title, respectively.
        if(options.imdb) {
            query.i = options.imdb;
        } else if(options.title) {
            query.t = options.title;

            // In order to search with a year, a title must be present.
            if(options.year) {
                query.y = options.year;
            }

        // Assume anything beginning with "tt" and ending with digits is an
        // IMDB ID.
        } else if(/^tt\d+$/.test(options)) {
            query.i = options;

        // Finally, assume options is a string repesenting the title.
        } else {
            query.t = options;
        }

        request({ url: host, qs: query }, function(err, res, body) {
            var movie;

            if(err) {
                return done(err);
            }

            if(res.statusCode !== 200) {
                return done(new Error(res.statusCode));
            }

            try {
                movie = JSON.parse(body);
            } catch(e) {
                return done(e);
            }

            // The movie being searched for could not be found.
            if(movie.Response === 'False') {
                return done(null, null);
            }

            // Replace 'N/A' strings with null for simple checks in the return
            // value.
            Object.keys(movie).forEach(function(key) {
                if(movie[key] === 'N/A') {
                    movie[key] = null;
                }
            });

            // Beautify and normalize the ugly results the API returns.
            done(null, {
                title: movie.Title,
                year: +movie.Year,
                rated: movie.Rated,

                // Cast the API's release date as a native JavaScript Date type.
                released: movie.Released ? new Date(movie.Released) : null,

                // Return runtime as minutes casted as a Number instead of an
                // arbitrary string.
                runtime: movie.Runtime ? formatRuntime(movie.Runtime) : null,

                genres: movie.Genre ? movie.Genre.split(', ') : null,
                director: movie.Director,
                writers: movie.Writer ? movie.Writer.split(', ') : null,
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

                type: movie.Type
            });
        });
    };
}());

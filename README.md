# omdb
A simple Node.JS module to access and normalize data from the
[OMDb API](http://www.omdbapi.com/) by Bryan Fritz.

## Installation
    $ npm install omdb

## Examples

```javascript
var omdb = require('omdb');

omdb.search('saw', function(err, movies) {
    if(err) {
        return console.error(err);
    }

    if(movies.length < 1) {
        return console.log('No movies were found!');
    }

    movies.forEach(function(movie) {
        console.log('%s (%d)', movie.title, movie.year);
    });

    // Saw (2004)
    // Saw II (2005)
    // Saw III (2006)
    // Saw IV (2007)
    // ...
});

omdb.get({ title: 'Saw', year: 2004 }, true, function(err, movie) {
    if(err) {
        return console.error(err);
    }

    if(!movie) {
        return console.log('Movie not found!');
    }

    console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
    console.log(movie.plot);

    // Saw (2004) 7.6/10
    // Two men wake up at opposite sides of a dirty, disused bathroom, chained
    // by their ankles to pipes. Between them lies...
});
```

## API
### .search(terms, callback)
Run a search request on the API. `terms` should be a string containing search
terms. `callback` returns an array of movies. If no movies are found, the array
is empty.

### .get(options, [fullPlot], callback)
Run a single movie request on the API.

`options` is assumed to be one of the following, respectively:

1. An object with an `imdb` property.

    `{ imdb: 'tt0387564' }`
2. An object with a `title` property.

    `{ title: 'Saw' }`
3. An object with *both* a `title` and a `year` property.

    `{ title: 'Saw', year: 2004 }`
4. An IMDb ID string.

    `'tt0387564'`
5. A title string.

    `'Saw'`

`fullPlot` is an optional argument that if set to `true`, will attempt to
request the extended version of the movie's plot.

`callback` returns an object of the movie's information. If no movies are
found, it will return `null`.

### .poster(options)
Return a readable stream of the poster JPEG.

`options` is the same as the `options` argument used in `.get()`.

## License
Copyright (C) (2013) Mister Hat

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see [http://www.gnu.org/licenses/].

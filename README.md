# omdb
[![npm](https://img.shields.io/npm/v/omdb.svg?style=flat-square)](https://www.npmjs.com/package/omdb)
[![npm](https://img.shields.io/npm/dt/omdb.svg?style=flat-square)](https://www.npmjs.com/package/omdb)
[![Travis Status](https://img.shields.io/travis/Fazendaaa/omdb.svg?style=flat-square)](https://travis-ci.org/Fazendaaa/omdb)
[![Dependencies](https://david-dm.org/Fazendaaa/omdb.svg?style=flat-square)](https://github.com/Fazendaaa/omdb/blob/master/package.json)
[![Codecov Status](https://img.shields.io/codecov/c/github//Fazendaaa/omdb/badge.svg?style=flat-square)](https://codecov.io/gh/Fazendaaa/omdb)
[![Maintainability](https://api.codeclimate.com/v1/badges/04c334bbe522d8a0823f/maintainability)](https://codeclimate.com/github/Fazendaaa/omdb/maintainability)

A simple [nodejs](https://nodejs.org/) package to access and normalize data from the
[OMDb API](https://www.omdbapi.com/) by Bryan Fritz. Written in [TypeScript](https://www.typescriptlang.org/).

## Installation
```bash
npm install omdb --save
```

**note**: _no need of installing @types/omdb, TS typings are linked int [package.json](./package.json)_

## Examples

```typescript
import { poster, search, setApi } from 'omdb';

setAPI('YourApiKeyHere');

search('Guardians of The Galaxy')
    .then(console.log)
    .catch(console.error);

search('tt2015381')
    .then(console.log)
    .catch(console.error);

search({ title: 'Guardians of The Galaxy', year: 2017 })
    .then(console.log)
    .catch(console.error);

poster({ imdbID: 'tt0944947' })
    .then(console.log)
    .catch(console.error);

const asyncExample = async (title: string): void => {
    const result = await search(title);

    console.log('While searching for: ', title, '. OMDB found the following:\n', result);
};

asyncExample('Guardians of The Galaxy II');
```

Output example of `search`:

```typescript
{
    Year: '2014',
    Type: 'movie',
    Country: 'USA',
    Rated: 'PG-13',
    Metascore: '76',
    Response: 'True',
    imdbRating: '8.1',
    DVD: '09 Dec 2014',
    Runtime: '121 min',
    imdbID: 'tt2015381',
    Language: 'English',
    imdbVotes: '871,949',
    Director: 'James Gunn',
    Released: '01 Aug 2014',
    BoxOffice: '$270,592,504',
    Title: 'Guardians of the Galaxy',
    Genre: 'Action, Adventure, Comedy',
    Production: 'Walt Disney Pictures',
    Actors: 'Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel',
    Awards: 'Nominated for 2 Oscars. Another 52 wins & 99 nominations.',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTAwMjU5OTgxNjZeQTJeQWpwZ15BbWU4MDUxNDYxODEx._V1_SX300.jpg',
    Website: 'http://marvel.com/guardians',
    Plot: 'A group of intergalactic criminals are forced to work together to stop a fanatical warrior from taking control of the universe.',
    Writer: 'James Gunn, Nicole Perlman, Dan Abnett (based on the Marvel comics by), Andy Lanning (based on the Marvel comics by), Bill Mantlo (character created by: Rocket Raccoon), Keith Giffen (character created by: Rocket Raccoon), Jim Starlin (characters created by: Drax the Destroyer,  Gamora & Thanos), Steve Englehart (character created by: Star-Lord), Steve Gan (character created by: Star-Lord), Steve Gerber (character created by: Howard the Duck), Val Mayerik (character created by: Howard the Duck)',
    Ratings: [
        {
            Value: '8.1/10',
            Source: 'Internet Movie Database'
        },
        {
            Value: '91%',
            Source: 'Rotten Tomatoes'
        },
        {
            Value: '76/100',
            Source: 'Metacritic'
        }
    ]
}
```

Output example of `poster`:

```typescript
<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff db 00 43 00 02 01 01 02 01 01 02 02 02 02 02 02 02 02 03 05 03 03 03 03 03 06 04 04 03 ... >
```

To run all of this examples and more, check the [tests](./tests/) folder.

## API
### setApi(apiKey)

`apiKey` (string): Configures the apiKey to be used in all searches, read more in how you can get one [here](http://www.omdbapi.com/apikey.aspx).

### search(terms)

`terms` (string | object): searches the OMDB database through media name, ID or the following object:

```typescript
{
    search: string,
    title(optional): string,
    imdbID(optional): string,
    year(optional): number | string,
    page(optional): number | string,
    plot(optional): 'full' | 'short',
    version(optional): number | string,
    type(optional): 'movie' | 'series' | 'episodes',
}
```

### poster(terms)
Return a stream of the poster JPEG.

`terms` is the same as in [search](###search).

## License
MIT

import { config } from 'dotenv';
import { poster, search, setAPI } from 'omdb';

config();

jest.setTimeout(10000);

describe('Testing setApi function', () => {
    describe('Documentation example', () => {
        beforeAll(() => {
            setAPI(<string>process.env.OMDB_KEY);
        });

        const first = {
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
            // tslint:disable-next-line: no-http-string
            Website: 'http://marvel.com/guardians',
            // tslint:disable-next-line: max-line-length
            Plot: 'A group of intergalactic criminals are forced to work together to stop a fanatical warrior from taking control of the universe.',
            // tslint:disable-next-line: max-line-length
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
        };

        test('By id', async () => expect(search('tt2015381')).resolves.toEqual(first));
    });

    describe('Error', () => {
        beforeAll(() => {
            setAPI('');
        });

        test('Search by id', async () => expect(search('tt2015381')).rejects.toEqual(new Error('Request error, code: 401')));

        test('Poster by id', async () => {
            // Only throws a message of error, once fixed needs to update: https://github.com/omdbapi/OMDb-API/issues/99
            return expect(poster('tt2015381')).resolves.toEqual(Buffer.from([
                69,
                114,
                114,
                111,
                114,
                58,
                32,
                73,
                110,
                118,
                97,
                108,
                105,
                100,
                32,
                65,
                80,
                73,
                32,
                107,
                101,
                121,
                33
            ]));
        });
    });
});

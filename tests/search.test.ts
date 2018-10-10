import { config } from 'dotenv';
import { search, setAPI } from 'omdb';

config();

jest.setTimeout(10000);

beforeAll(() => {
    setAPI(<string> process.env.OMDB_KEY);
});

describe('Testing search function', () => {
    describe('Documentation example', () => {
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

        test('By search string', async () => expect(search('Guardians of the Galaxy')).resolves.toEqual(first));

        test('By title', async () => expect(search({ title: 'Guardians of the Galaxy' })).resolves.toEqual(first));

        test('By title and version', async () => expect(search({ title: 'Guardians of the Galaxy', version: 1 })).resolves.toEqual(first));

        test('By ID and short plot', async () => expect(search({ imdbID: 'tt2015381', plot: 'short' })).resolves.toEqual(first));

        test('By title and year', async () => {
            const second = {
                Type: 'movie',
                Year: '2017',
                Rated: 'PG-13',
                Country: 'USA',
                Metascore: '67',
                Response: 'True',
                imdbRating: '7.7',
                Runtime: '136 min',
                DVD: '22 Aug 2017',
                imdbID: 'tt3896198',
                Language: 'English',
                imdbVotes: '408,619',
                Director: 'James Gunn',
                Released: '05 May 2017',
                BoxOffice: '$389,804,217',
                Production: 'Walt Disney Pictures',
                Genre: 'Action, Adventure, Comedy',
                Title: 'Guardians of the Galaxy Vol. 2',
                Website: 'https://marvel.com/guardians',
                Actors: 'Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel',
                Awards: 'Nominated for 1 Oscar. Another 12 wins & 42 nominations.',
                Poster: 'https://m.media-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg',
                // tslint:disable-next-line: max-line-length
                Plot: 'The Guardians must fight to keep their newfound family together as they unravel the mystery of Peter Quill\'s true parentage.',
                // tslint:disable-next-line: max-line-length
                Writer: 'James Gunn, Dan Abnett (based on the Marvel comics by), Andy Lanning (based on the Marvel comics by), Steve Englehart (Star-Lord created by), Steve Gan (Star-Lord created by), Jim Starlin (Gamora and Drax created by), Stan Lee (Groot created by), Larry Lieber (Groot created by), Jack Kirby (Groot created by), Bill Mantlo (Rocket Raccoon created by), Keith Giffen (Rocket Raccoon created by), Steve Gerber (Howard the Duck created by), Val Mayerik (Howard the Duck created by)',
                Ratings: [
                    {
                        Value: '7.7/10',
                        Source: 'Internet Movie Database'
                    },
                    {
                        Value: '83%',
                        Source: 'Rotten Tomatoes'
                    },
                    {
                        Value: '67/100',
                        Source: 'Metacritic'
                    }
                ]
            };

            return expect(search({ title: 'Guardians of the Galaxy', year: 2017 })).resolves.toEqual(second);
        });

        test('By ID and full plot', async () => {
            const response = {
                Year: '2014',
                Type: 'movie',
                Country: 'USA',
                Rated: 'PG-13',
                Metascore: '76',
                Response: 'True',
                imdbRating: '8.1',
                Runtime: '121 min',
                DVD: '09 Dec 2014',
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
                Plot: 'After stealing a mysterious orb in the far reaches of outer space, Peter Quill from Earth, is now the main target of a manhunt led by the villain known as Ronan the Accuser. To help fight Ronan and his team and save the galaxy from his power, Quill creates a team of space heroes known as the \"Guardians of the Galaxy\" to save the world.',
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

            return expect(search({ imdbID: 'tt2015381', plot: 'full' })).resolves.toEqual(response);
        });

        test('By search', async () => {
            const response = {
                Response: 'True',
                totalResults: '11',
                Search: [
                    {
                        Year: '2014',
                        Type: 'movie',
                        imdbID: 'tt2015381',
                        Title: 'Guardians of the Galaxy',
                        Poster: 'https://m.media-amazon.com/images/M/MV5BMTAwMjU5OTgxNjZeQTJeQWpwZ15BbWU4MDUxNDYxODEx._V1_SX300.jpg'
                    },
                    {
                        Type: 'movie',
                        Year: '2017',
                        imdbID: 'tt3896198',
                        Title: 'Guardians of the Galaxy Vol. 2',
                        Poster: 'https://m.media-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg'
                    },
                    {
                        Year: '2015–',
                        Type: 'series',
                        imdbID: 'tt4176370',
                        Title: 'Guardians of the Galaxy',
                        Poster: 'https://m.media-amazon.com/images/M/MV5BNDM4NDQxMDU2MV5BMl5BanBnXkFtZTgwMDY2MDQ5NjE@._V1_SX300.jpg'
                    },
                    {
                        Year: '2017',
                        Type: 'movie',
                        imdbID: 'tt7131308',
                        Title: 'Guardians of the Galaxy: Inferno',
                        // tslint:disable-next-line: max-line-length
                        Poster: 'https://m.media-amazon.com/images/M/MV5BZGQ0YzEyNWQtNGJiMi00NTAxLThkNDctNGY2ODkzYWMxZmZkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg'
                    },
                    {
                        Type: 'game',
                        Year: '2017',
                        imdbID: 'tt6636812',
                        Title: 'Guardians of the Galaxy: The Telltale Series',
                        // tslint:disable-next-line: max-line-length
                        Poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMzkwYzJkOTYtOWVlZC00Mzk3LThlZTktYWY3MDM3N2IwZDA3XkEyXkFqcGdeQXVyNTk5Nzg0MDE@._V1_SX300.jpg'
                    },
                    {
                        Year: '2017',
                        Type: 'movie',
                        imdbID: 'tt7387224',
                        Title: 'LEGO Marvel Super Heroes - Guardians of the Galaxy: The Thanos Threat',
                        // tslint:disable-next-line: max-line-length
                        Poster: 'https://m.media-amazon.com/images/M/MV5BMDFlNTI1MTgtNmU5Zi00YjNkLWEzMGQtM2ExZmRlNDkzZDcxXkEyXkFqcGdeQXVyMDQzODc1OA@@._V1_SX300.jpg'
                    },
                    {
                        Year: '2017',
                        Type: 'movie',
                        imdbID: 'tt7134278',
                        Title: 'Disneyland Resort: Guardians of the Galaxy, Mission Breakout!',
                        // tslint:disable-next-line: max-line-length
                        Poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BZWNjNWIwMTYtZWNkNi00OGE4LWI4YzgtNTk5ZTYxNTQyNmU1XkEyXkFqcGdeQXVyNjc4OTg3Mzg@._V1_SX300.jpg'
                    },
                    {
                        Year: '2017',
                        Type: 'movie',
                        Poster: 'N/A',
                        imdbID: 'tt7312152',
                        Title: 'Bonus Round: The Making of \'Guardians of the Galaxy Vol. 2\''
                    },
                    {
                        Year: '2020',
                        Type: 'movie',
                        Poster: 'N/A',
                        imdbID: 'tt6791350',
                        Title: 'Guardians of the Galaxy Vol. 3'
                    },
                    {
                        Year: '2014',
                        Poster: 'N/A',
                        Type: 'movie',
                        imdbID: 'tt5286008',
                        Title: 'The Intergalactic Visual Effects of \'Guardians of the Galaxy\''
                    }
                ]
            };

            return expect(search({ search: 'Guardians of the Galaxy' })).resolves.toEqual(response);
        });
    });

    describe('Game of Thrones', () => {
        const response = {
            Year: '2011–',
            Type: 'series',
            Rated: 'TV-MA',
            Director: 'N/A',
            Metascore: 'N/A',
            Response: 'True',
            Runtime: '57 min',
            imdbRating: '9.5',
            totalSeasons: '8',
            Country: 'USA, UK',
            imdbID: 'tt0944947',
            Language: 'English',
            imdbVotes: '1,361,235',
            Released: '17 Apr 2011',
            Title: 'Game of Thrones',
            Genre: 'Action, Adventure, Drama, Fantasy, Romance',
            Writer: 'David Benioff, D.B. Weiss',
            Awards: 'Won 1 Golden Globe. Another 273 wins & 454 nominations.',
            Actors: 'Peter Dinklage, Lena Headey, Emilia Clarke, Kit Harington',
            Poster: 'https://m.media-amazon.com/images/M/MV5BMjE3NTQ1NDg1Ml5BMl5BanBnXkFtZTgwNzY2NDA0MjI@._V1_SX300.jpg',
            // tslint:disable-next-line: max-line-length
            Plot: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.',
            Ratings: [
                {
                    Value: '9.5/10',
                    Source: 'Internet Movie Database'
                }
            ]
        };

        test('By name', async () => expect(search('Game of Thrones')).resolves.toEqual(response));

        test('By ID', async () => expect(search('tt0944947')).resolves.toEqual(response));

        test('By ID and episode', async () => expect(search({ imdbID: 'tt0944947', type: 'episode' })).resolves.toEqual(response));

        test('By ID and series', async () => expect(search({ imdbID: 'tt0944947', type: 'series' })).resolves.toEqual(response));

        test('By ID and page', async () => expect(search({ imdbID: 'tt0944947', page: 1 })).resolves.toEqual(response));
    });

    describe('Errors', () => {
        const err = {
            Response: 'False',
            Error: 'Movie not found!'
        };

        test('Invalid movie name', async () => expect(search('loremipsum')).resolves.toEqual(err));
    });
});

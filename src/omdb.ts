import { IncomingMessage } from 'http';
import { get } from 'https';
import { parseSearch } from 'parse';
import { Readable, Transform } from 'stream';

export type Plot = 'full' |
                   'short';

export type Type = 'movie' |
                   'series' |
                   'episode';

export type Response = 'True' |
                       'False';

export interface Ratings {
    readonly Value: string;
    readonly Source: string;
}

export interface Terms {
    readonly type?: Type;
    readonly plot?: Plot;
    readonly title?: string;
    readonly search?: string;
    readonly imdbID?: string;
    readonly year?: number | string;
    readonly page?: number | string;
    readonly version?: number | string;
}

export interface OMDBData {
    readonly Type: Type;
    readonly DVD: string;
    readonly Year: string;
    readonly Plot: string;
    readonly Title: string;
    readonly Genre: string;
    readonly Rated: string;
    readonly imdbID: string;
    readonly Writer: string;
    readonly Actors: string;
    readonly Awards: string;
    readonly Poster: string;
    readonly Website: string;
    readonly Country: string;
    readonly Runtime: string;
    readonly Ratings: Ratings;
    readonly Language: string;
    readonly Director: string;
    readonly Released: string;
    readonly imdbVotes: string;
    readonly Metascore: string;
    readonly BoxOffice: string;
    readonly Response: Response;
    readonly imdbRating: string;
    readonly Production: string;
    readonly totalSeasons: string;
}

export interface Search {
    readonly Year: string;
    readonly Type: string;
    readonly Title: string;
    readonly imdbID: string;
    readonly Poster: string;
}

export interface OMDBResponse {
    readonly Search: Search;
    readonly Response: Response;
    readonly totalResults: string;
}

export interface OMDBError {
    readonly Error: Error;
    readonly Response: Response;
}

export type OMDB = OMDBData |
                   OMDBError |
                   XMLDocument |
                   OMDBResponse;

interface HandleSearch {
    readonly res: IncomingMessage;
    readonly reject: (err: Error) => void;
    readonly resolve: (err: OMDB) => void;
}

interface HandlePoster {
    readonly res: IncomingMessage;
    readonly reject: (err: Error) => void;
    readonly resolve: (err: Readable) => void;
}

interface OMDBRequest {
    readonly handle: Function;
    readonly hostname: string;
    readonly terms: string | Terms;
}

let apiKey = '';

const handleSearch = ({ res, reject, resolve }: HandleSearch) => {
    let chunk = '';
    const { statusCode } = res;

    if (200 !== statusCode) {
        reject(new Error(`Request error, code: ${statusCode}`));
    }

    res.setEncoding('utf8')
       .on('error', reject)
       .on('uncaughtException', reject)
       .on('data', (data: string) => chunk += data)
       .on('end', () => {
           resolve(JSON.parse(chunk));
        });
};

const handlePoster = ({ res, reject, resolve }: HandlePoster) => {
    const chunk = new Transform();
    const { statusCode } = res;

    if (200 !== statusCode) {
        reject(new Error(`Request error, code: ${statusCode}`));
    }

    res.on('error', reject)
       .on('uncaughtException', reject)
       .on('data', (data: Readable) => chunk.push(data))
       .on('end', () => {
           resolve(chunk.read());
        });
};

const requestApi = async ({ terms, hostname, handle }: OMDBRequest) => {
    return new Promise((resolve: (data: OMDB | Readable) => void, reject: (err: Error) => void) => {
        get({ hostname, path: parseSearch({ apiKey, terms }), rejectUnauthorized: false })
            .on('response', ((res: IncomingMessage) => handle({ res, resolve, reject })))
            .on('error', reject)
            .end();
    });
};

/**
 * Configures the API key to be used in all requests
 *
 * @param key The key to be configured
 * @returns The configured API key
 */
export const setAPI = (key: string): string => {
    apiKey = key;

    return apiKey;
};

/**
 * Searches all kind of media in OMDB system for the content
 *
 * @param terms The query data to be searched for
 * @returns The matched data
 */
export const search = async (terms: string | Terms): Promise<OMDB> => <Promise<OMDB>> requestApi({
    terms,
    handle: handleSearch,
    hostname: 'www.omdbapi.com'
});

/**
 * Fetches the stream of the JPEG poster
 *
 * @param terms Search content
 * @returns The poster
 */
export const poster = async (terms: string | Terms): Promise<Readable> => <Promise<Readable>> requestApi({
    terms,
    handle: handlePoster,
    hostname: 'img.omdbapi.com'
});

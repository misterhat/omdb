import { Terms } from 'omdb';

interface ParseSearch {
    readonly apiKey: string;
    readonly terms: string | Terms;
}

const replaceSpace = (toBeReplaced: string): string => toBeReplaced.replace(/\s/gm, '+');

const stringToQuery = (search: string): string => {
    const matches = search.match(/tt\d*/gm);

    return (null !== matches) ? `i=${matches[0]}` : `t=${replaceSpace(search)}`;
};

const searchToQuery = ({ imdbID, title, year, type, plot, version, search, page }: Terms): string => {
    const response = <string[]> [];

    if (undefined !== year && null !== year) {
        response.push(`y=${year}`);
    } if (undefined !== type && null !== type) {
        response.push(`type=${type}`);
    } if (undefined !== plot && null !== plot) {
        response.push(`plot=${plot}`);
    } if (undefined !== page && null !== page) {
        response.push(`page=${page}`);
    } if (undefined !== title && null !== title) {
        response.push(`t=${replaceSpace(title)}`);
    } if (undefined !== imdbID && null !== imdbID) {
        response.push(`i=${imdbID}`);
    } if (undefined !== search && null !== search) {
        response.push(`s=${replaceSpace(search)}`);
    } if (undefined !== version && null !== version) {
        response.push(`v=${version}`);
    }

    return response.join('&');
};

/**
 * Parse the search content to a string to be sent as path to the OMDB API
 *
 * @param context Values to be used in the search
 * @returns The path query
 */
export const parseSearch = ({ terms, apiKey }: ParseSearch): string => {
    const query = ('string' === typeof (terms)) ? stringToQuery(terms) : searchToQuery(terms);

    return `/?apikey=${apiKey}&${query}`;
};

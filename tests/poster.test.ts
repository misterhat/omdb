import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { poster, setAPI } from 'omdb';
import { join } from 'path';

config();

jest.setTimeout(10000);

let data: Buffer;

beforeAll(() => {
    setAPI(<string> process.env.OMDB_KEY);
    data = readFileSync(join(__dirname, '../mocks/poster.jpg'));
});

describe('Testing poster function', () => {
    describe('Documentation example', () => {
        test('Getting by name', async () => expect(poster({ imdbID: 'tt0944947' })).resolves.toEqual(data));
    });
});

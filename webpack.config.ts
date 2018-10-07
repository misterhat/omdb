import { join } from 'path';

module.exports = {
    target: 'node',
    mode: 'development',
    entry: join(__dirname, './src/omdb.ts'),
    node: {
        __dirname: false
    },
    output: {
        filename: 'omdb.js',
        path: join(__dirname, 'dist')
    },
    resolve: {
        alias: {
            omdb: join(__dirname, './src/omdb.ts'),
            parse: join(__dirname, './src/parse.ts')
        },
        extensions: [
            '.js',
            '.ts',
            '.tsx'
        ]
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /tests/
                ]
            }
        ]
    }
};

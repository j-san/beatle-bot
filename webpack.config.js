/* eslint-env node */
var path = require('path');

module.exports = {
    entry: {
        main: './js/main.js',
        test: './test/run.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, '/build/'),
        publicPath: 'build/',
        sourceMapFilename: '[file].map',
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-1'],
                    plugins: ['transform-runtime']
                }
            },
            { test: /\.css$/,                               loader: 'style!css' },
            { test: /\.(jpe?g|gif|png|svg)$/,               loader: 'file-loader?name=[name].[hash].[ext]' },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/,   loader: 'file-loader?name=[name].[hash].[ext]' }
        ],
    },
    devtool: 'source-map',
    watchOptions: {
        poll: true
    }
};

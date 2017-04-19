const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        filename: './src/index.js',
    },
    output: {
        filename: './dist/main.js',
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './src/index.html',
                to: './dist/index.html',
            },
            {
                from: './src/style.css',
                to: './dist/style.css',
            },
            {
              from: './lib/jquery-3.2.1.min.js',
              to: './dist/jquery-3.2.1.min.js',
            }]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                },
            },
        ],
    },
};




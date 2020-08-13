/* eslint-env node */
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
let env = process.env.NODE_ENV;
let packConf = {
    entry: {
        'index': './src/js/index.js',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'js/[name]' + '.js',
        publicPath: process.env.NODE_ENV !== 'production' ?'/':'./'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    devServer: {
        port: 9010,
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader', // url-loader 可对图片进行限制 以及转成base64 file-loader 则对图片进行正常产出
                    options: {
                        limit: 8 * 1024, // 大于200kb 则正常产出图片
                        outputPath: './img/',
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : {
                        loader:MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style/[name].css',
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
        }),
        new UglifyjsWebpackPlugin()
    ]
};
module.exports = packConf;
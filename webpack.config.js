'use strict';

var webpack = require('webpack'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    common_config = require('./webpack.common.config');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-router', 'redux', 'react-redux'],
        app: path.join(srcPath, 'app.js'),
        legacy: path.join(srcPath, 'legacy/app.js'),
        guide: path.join(srcPath, 'guide/app.js')
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].js?v='+ common_config.hash,
        library: ['[name]'],
        pathInfo: true
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: 'coffee-loader' },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)(\?.*)?$/, loader: 'url-loader?limit=8192&name=images/[hash].[ext]?v='+ common_config.hash+'!image-maxsize?max-width=1600'},
            { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff&name=fonts/[hash].[ext]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=fonts/[hash].[ext]" },
            { test: /\.ejs$/, loader: 'ejs-compiled?htmlmin' },
            { test: /\.mp4$/, loader: 'file-loader?name=videos/[hash].[ext]?v='+ common_config.hash},
            { test: /\.(mp3|wav)$/, loader: 'file-loader?name=audio/[hash].[ext]?v='+ common_config.hash},
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.jsx', '.json', '.coffee', '.less', '.css', '.png', '.jpg', '.gif'],
        modulesDirectories: ['node_modules', 'src']
    },
    plugins: [
        common_config.plugins.chunkVendorPlugin,
        common_config.plugins.HTMLInjectPlugin,
        common_config.plugins.LegacyHTMLInjectPlugin,
        common_config.plugins.StyleGuideInjectPlugin,
        common_config.plugins.noErrorsPlugin,
        new OpenBrowserPlugin({}),
        common_config.plugins.magicGlobalsPlugin,
        new webpack.HotModuleReplacementPlugin()
    ],
    debug: true,
    devtool: 'source-map',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
};

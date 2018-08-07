"use strict";

var webpack = require("webpack"),
  config = require("./webpack.config"),
  common_config = require("./webpack.common.config");

config.debug = false;
config.devtool = "source-map";
config.plugins = [
  common_config.plugins.CleanWebpackPlugin,
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  common_config.plugins.chunkVendorPlugin,
  common_config.plugins.HTMLInjectPlugin,
  common_config.plugins.LegacyHTMLInjectPlugin,
  common_config.plugins.StyleGuideInjectPlugin,
  common_config.plugins.noErrorsPlugin,
  common_config.plugins.magicGlobalsPlugin
];

module.exports = config;

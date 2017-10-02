var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var isProduction = (env === 'prod');

// helpers for writing path names
// e.g. join("web/static") => "/full/disk/path/to/hello/web/static"
function join(dest) { return path.resolve(__dirname, dest); }
function web(dest) { return join("web/static/" + dest); }

var plugins = [
  new ExtractTextPlugin('css/app.css'),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  })
];

// This is necessary to get the sass @import's working
var stylePathResolves = (
    'includePaths[]=' + path.resolve('./') + '&' +
    'includePaths[]=' + path.resolve('./node_modules')
  );

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
  entry: [
    web('js/index.jsx'),
    web('css/style.scss')
  ],

  output: {
    path: join('priv/static'),
    filename: 'js/app.js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    alias: {
      phoenix: __dirname + '/deps/phoenix/web/static/js/phoenix.js'
    }
  },

  module: {
        loaders: [
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015', 'stage-0', 'react']
              }
            },
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!sass-loader?' + stylePathResolves
              })
            },
            {
              test: /\.(png|gif)$/,
              loader: 'url-loader'
            }

        ]
  },

  plugins: plugins
};

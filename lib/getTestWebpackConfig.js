var path = require('path');
var assign = require('object-assign');
var webpack = require('atool-build/lib/webpack');
var getWebpackCommonConfig = require('atool-build/lib/getWebpackCommonConfig');
var getBabelCommonConfig = require('atool-build/lib/getBabelCommonConfig');
var mergeCustomConfig = require('atool-build/lib/mergeCustomConfig');

module.exports = function getTestWebpackConfig() {

  var config = mergeCustomConfig(getWebpackCommonConfig({
    cwd: process.cwd()
  }), path.join(process.cwd(), './webpack.config.js'));

  var webpackConfig = assign({}, config, {
    entry: {},
    devtool: 'inline-source-map',
    externals: [],
    output: {},
    isparta: {
      embedSource: true,
      noAutoWrap: true,
      babel: getBabelCommonConfig()
    }
  });

  webpackConfig.resolve.modulesDirectories.push(path.join(__dirname, '../node_modules'));
  webpackConfig.resolveLoader.modulesDirectories.push(path.join(__dirname, '../node_modules'));

  var preLoaders = [
    {
      test: /\.jsx?$/,
      exclude: /(__tests__|tests|node_modules|bower_components)/,
      loader: 'isparta-loader'
    }
  ];

  if (webpackConfig.module.preLoaders) {
    webpackConfig.module.preLoaders.concat(preLoaders);
  } else {
    webpackConfig.module.preLoaders = preLoaders;
  }

  // remove CommonsChunkPlugin
  // https://github.com/webpack/karma-webpack/issues/24
  for(var i = 0; i < webpackConfig.plugins.length; i++) {
    if (webpackConfig.plugins[i].chunkNames === 'common') {
      webpackConfig.plugins.splice(i, 1);
      break;
    }
  }

  webpackConfig.plugins.push(
    new webpack.ProgressPlugin(function (percentage, msg) {
      var stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(msg);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('\n');
      }
    })
  );

  return webpackConfig;
};

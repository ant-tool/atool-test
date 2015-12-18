var path = require('path');
var assign = require('object-assign');
var webpack = require('webpack');
var getWebpackCommonConfig = require('atool-build/lib/getWebpackCommonConfig');
var getBabelCommonConfig = require('atool-build/lib/getBabelCommonConfig');

module.exports = function getTestWebpackConfig() {

  var webpackConfig = assign({}, getWebpackCommonConfig({
    cwd: process.cwd()
  }), {
    devtool: 'inline-source-map',
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
      exclude: /(__tests__|node_modules|bower_components)/,
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
  webpackConfig.plugins.shift();

  webpackConfig.plugins.push(
    new webpack.ProgressPlugin(function (percentage, msg) {
      var stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(msg);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('\nwebpack: bundle build is now finished.');
      }
    })
  );

  return webpackConfig;
}

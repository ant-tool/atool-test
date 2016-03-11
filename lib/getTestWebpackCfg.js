'use strict';

var _path = require('path');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _getWebpackCommonConfig = require('atool-build/lib/getWebpackCommonConfig');

var _getWebpackCommonConfig2 = _interopRequireDefault(_getWebpackCommonConfig);

var _mergeCustomConfig = require('atool-build/lib/mergeCustomConfig');

var _mergeCustomConfig2 = _interopRequireDefault(_mergeCustomConfig);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

var commonConfig = (0, _getWebpackCommonConfig2.default)({
  cwd: process.cwd()
});

var customConfigPath = (0, _path.join)(cwd, 'webpack.config.js');

var webpackConfig = (0, _objectAssign2.default)({}, (0, _mergeCustomConfig2.default)(commonConfig, customConfigPath), {
  devtool: '#inline-source-map'
});

var preLoaders = [{
  test: /\.jsx?$/,
  exclude: /(__tests__|tests|node_modules|bower_components)/,
  loader: 'isparta'
}];

delete webpackConfig.babel.cacheDirectory;

if (webpackConfig.module.preLoaders) {
  webpackConfig.module.preLoaders.concat(preLoaders);
} else {
  webpackConfig.module.preLoaders = preLoaders;
}

webpackConfig.module.noParse = [/\/sinon\.js/];

webpackConfig.plugins.push(new _htmlWebpackPlugin2.default({
  template: (0, _path.join)(__dirname, './runner.html'),
  inject: false
}));

webpackConfig.resolve.modulesDirectories.push((0, _path.join)(__dirname, '../node_modules'));
webpackConfig.resolveLoader.modulesDirectories.push((0, _path.join)(__dirname, '../node_modules'));
webpackConfig.output.libraryTarget = 'var';

module.exports = function getTestWebpackCfg(assertLib) {
  var testFiles = _glob2.default.sync((0, _path.join)(process.cwd(), '!(node_modules)/**/*-test.js'));
  var setupFile = './setup.js';
  if (assertLib !== 'undefined' && assertLib !== 'chaijs') {
    setupFile = './setup_assert.js';
  }
  testFiles.splice(0, 0, (0, _path.join)(__dirname, setupFile));
  webpackConfig.entry = {
    test: testFiles,
    mocha: (0, _path.join)(require.resolve('mocha'), '../mocha.js')
  };
  return webpackConfig;
};
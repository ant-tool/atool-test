import { join } from 'path';
import glob from 'glob';
import assign from 'object-assign';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import getBabelCommonConfig from 'atool-build/lib/getBabelCommonConfig';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const cwd = process.cwd();

const commonConfig = getWebpackCommonConfig({
  cwd: process.cwd(),
});

const customConfigPath = join(cwd, 'webpack.config.js');

const webpackConfig = assign({}, mergeCustomConfig(commonConfig, customConfigPath), {
  devtool: '#inline-source-map',
  isparta: {
    embedSource: true,
    noAutoWrap: true,
    babel: getBabelCommonConfig(),
  },
});

const preLoaders = [
  {
    test: /\.jsx?$/,
    exclude: /(__tests__|tests|node_modules|bower_components)/,
    loader: 'isparta',
  },
];

if (webpackConfig.module.preLoaders) {
  webpackConfig.module.preLoaders.concat(preLoaders);
} else {
  webpackConfig.module.preLoaders = preLoaders;
}

webpackConfig.module.noParse = [
  /\/sinon\.js/,
];

webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'runner.html',
    template: join(__dirname, './runner.html'),
    inject: false,
  })
);

webpackConfig.resolve.modulesDirectories.push(join(__dirname, '../node_modules'));
webpackConfig.resolveLoader.modulesDirectories.push(join(__dirname, '../node_modules'));
webpackConfig.output.libraryTarget = 'var';

module.exports = function getTestWebpackCfg(assertLib) {
  const testFiles = glob.sync(join(process.cwd(), '!(node_modules)/**/*-test.js'));
  let setupFile = './setup.js';
  if (assertLib !== 'undefined' && assertLib !== 'chaijs') {
    setupFile = './setup_assert.js';
  }
  testFiles.splice(0, 0, join(__dirname, setupFile));
  webpackConfig.entry = {
    test: testFiles,
    mocha: join(require.resolve('mocha'), '../mocha.js'),
  };
  return webpackConfig;
};

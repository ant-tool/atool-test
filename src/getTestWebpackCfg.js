import { join } from 'path';
import glob from 'glob';
import assign from 'object-assign';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const cwd = process.cwd();

const commonConfig = getWebpackCommonConfig({
  cwd: process.cwd(),
});

const customConfigPath = join(cwd, 'webpack.config.js');

const webpackConfig = assign({}, mergeCustomConfig(commonConfig, customConfigPath), {
  devtool: '#inline-source-map',
  externals: []
});

const preLoaders = [
  {
    test: /\.jsx?$/,
    exclude: /(__tests__|tests|node_modules|bower_components)/,
    loader: 'isparta',
  },
];

delete webpackConfig.babel.cacheDirectory;

if (webpackConfig.module.preLoaders) {
  webpackConfig.module.preLoaders.concat(preLoaders);
} else {
  webpackConfig.module.preLoaders = preLoaders;
}

webpackConfig.module.noParse = [
  /\/sinon\.js/,
];

for (let i = 0; i < webpackConfig.plugins.length; i++) {
  if (webpackConfig.plugins[i].chunkNames === 'common') {
    webpackConfig.plugins.splice(i, 1);
    break;
  }
}
webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    template: join(__dirname, './runner.html'),
    inject: false,
  })
);

webpackConfig.resolve.modulesDirectories.push(join(__dirname, '../node_modules'));
webpackConfig.resolveLoader.modulesDirectories.push(join(__dirname, '../node_modules'));
webpackConfig.output.libraryTarget = 'var';

module.exports = function getTestWebpackCfg(assertLib) {
  const testFiles = glob.sync(join(process.cwd(), '!(node_modules)/**/*-test.js'));
  const setupFile = assertLib === 'chaijs' ? './setup.js' : './setup_assert.js';
  testFiles.splice(0, 0, join(__dirname, setupFile));
  webpackConfig.entry = {
    test: testFiles,
    mocha: join(require.resolve('mocha'), '../mocha.js'),
  };
  return webpackConfig;
};

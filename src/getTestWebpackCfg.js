import { join } from 'path';
import glob from 'glob';
import assign from 'object-assign';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const cwd = process.cwd();

const commonConfig = getWebpackCommonConfig({ cwd });

module.exports = function getTestWebpackCfg(chai, coverage, config) {
  const customConfigPath = join(cwd, config);

  const webpackConfig = assign({}, mergeCustomConfig(commonConfig, customConfigPath), {
    devtool: '#inline-source-map',
  });

  delete webpackConfig.babel.cacheDirectory;

  webpackConfig.module.noParse = [
    /\/sinon\.js/,
  ];

  for (let i = 0; i < webpackConfig.plugins.length; i++) {
    if (webpackConfig.plugins[i].chunkNames === 'common') {
      webpackConfig.plugins.splice(i, 1);
      break;
    }
  }

  const htmlPluginFiles = webpackConfig.htmlWebpackPlugin && webpackConfig.htmlWebpackPlugin.files || {};
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: join(__dirname, './runner.ejs'),
      inject: false,
      filename: 'runner.html',
      files: {
        css: htmlPluginFiles.css || [],
        js: htmlPluginFiles.js || [],
      }
    })
  );

  webpackConfig.resolve.modulesDirectories.push(join(__dirname, '../node_modules'));
  webpackConfig.resolveLoader.modulesDirectories.push(join(__dirname, '../node_modules'));
  webpackConfig.output.libraryTarget = 'var';

  if (coverage) {
    const preLoaders = [
      {
        test: /\.jsx?$/,
        exclude: /(__tests__|tests|test|node_modules|bower_components)/,
        loader: 'isparta',
      },
    ];
    if (webpackConfig.module.preLoaders) {
      webpackConfig.module.preLoaders.concat(preLoaders);
    } else {
      webpackConfig.module.preLoaders = preLoaders;
    }
  }

  let testFiles = [join(__dirname, chai ? './setup_chai.js' : './setup.js')];

  // test some test-files
  const entryFiles = webpackConfig.atoolTestSpec;
  if (entryFiles && entryFiles.length) {
    entryFiles.forEach(f => {
      const files = glob.sync(join(cwd, f));
      testFiles.push.apply(testFiles, files);
    });
  } else {
    const globFiles = glob.sync(join(cwd, '!(node_modules)/**/*-+(test|spec).+(ts|js)'));
    testFiles = testFiles.concat(globFiles);
  }

  webpackConfig.entry = {
    test: Array.from(new Set(testFiles)),
    mocha: join(require.resolve('mocha'), '../mocha.js'),
  };

  return webpackConfig;
};

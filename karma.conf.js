var path = require('path');
var cwd = process.cwd();
var getWebpackCommonConfig = require('atool-build/lib/getWebpackCommonConfig');
var webpack = require('webpack');

var webpackConfig = getWebpackCommonConfig({
  cwd: cwd
});

webpackConfig.devtool = 'inline-source-map';

// CommonsChunkPlugin 出来的common.js 会导致报错
// https://github.com/webpack/karma-webpack/issues/24
webpackConfig.plugins = [
  new webpack.ProgressPlugin(function(percentage, msg) {
    var stream = process.stderr;
    if (stream.isTTY && percentage < 0.71) {
      stream.cursorTo(0);
      stream.write(msg);
      stream.clearLine(1);
    } else if (percentage === 1) {
      console.log('\nwebpack: bundle build is now finished.');
    }
  }),
  //new webpack.NormalModuleReplacementPlugin(/^sinon$/, './setup/sinon-1.17.2.js'),
];

// https://github.com/webpack/webpack/issues/304
//webpackConfig.module.noParse = [/\/sinon.js/];

// 测试覆盖率
//var preLoaders = [
//  {
//    test: /\.jsx?$/,
//    //include: /src/, //TODO  优化: 拿到源码路径比用 exclude 好
//    exclude: /(__tests__|node_modules|bower_components)/,
//    loader: 'isparta'
//  }
//];
//
//if (webpackConfig.module.preLoaders) {
//  webpackConfig.module.preLoaders.concat(preLoaders);
//} else {
//  webpackConfig.module.preLoaders = preLoaders;
//}

var base_test_dir = '__test__';
var testArgs = process.argv.slice(4);
var testParam = testArgs.indexOf('--test-dir');
if (testParam > -1) {
  base_test_dir = testArgs[testParam + 1];
}

// files to test
var files_to_test = path.resolve(cwd, './'+ base_test_dir +'/**/*-test.js');
var preprocessor = {};
preprocessor[files_to_test] = ['webpack', 'sourcemap'];
preprocessor['./lib/setup.js'] = ['webpack'];

module.exports = function (config) {
  config.set({

    basePath: '.',

    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: ['mocha'],

    files: [
      './phantomjs-polyfill.js',
      './lib/setup.js',
      files_to_test,
    ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-phantomjs-launcher"),
      require('karma-coverage')
    ],

    reporters: ['mocha', 'coverage'],

    preprocessors: preprocessor,

    // 不能在 terminal 输出 coverage 的同时,生成其他格式的 reporters
    coverageReporter: {
      dir : path.join(cwd, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir:'.', file: 'text-summary.txt' },
        { type: 'json-summary', subdir:'.', file: 'json-summary.json'}
      ]
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true
    }

  });
};

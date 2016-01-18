var path = require('path');
var cwd = process.cwd();
var getTestWebpackConfig = require('./lib/getTestWebpackConfig');
var webpackConfig = getTestWebpackConfig();

// files to test
var files_to_test = path.resolve(cwd, './!(node_modules)/**/*-test.js');

module.exports = function (config) {
  config.set({

    basePath: '.',

    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: ['mocha', 'sinon-chai'],

    files: [
      './phantomjs-polyfill.js',
      files_to_test,
    ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher"),
      require('karma-coverage'),
      require('karma-sinon-chai')
    ],

    reporters: ['mocha', 'coverage'],

    preprocessors: {
      [files_to_test]: ['webpack', 'sourcemap']
    },

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

var path = require('path');
var cwd = process.cwd();
var getTestWebpackConfig = require('./lib/getTestWebpackConfig');
var webpackConfig = getTestWebpackConfig();
var confUtil = require('./lib/conf_util');

var browserStr = confUtil.getValueFromArgv(process.argv, '--browsers');
var browsers = browserStr && browserStr.split(',');
var assertLibs = confUtil.getValueFromArgv(process.argv, '--assert');

var frameworks = confUtil.getFrameworks(assertLibs);
var launchers = confUtil.getBrowserLauncherPlugins(browsers);
var assertPlugin = confUtil.getAssertLibraryPlugin(assertLibs);

// files to test
var files_to_test = path.resolve(cwd, './!(node_modules)/**/*-test.js');

module.exports = function (config) {
  config.set({

    basePath: '.',

    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: frameworks,

    files: [
      './phantomjs-polyfill.js',
      files_to_test,
    ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require('karma-coverage')
    ].concat(launchers, assertPlugin),

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

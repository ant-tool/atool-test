var webpack = require('webpack');
var path = require('path');
var cwd = process.cwd();

// TODO 测试配置

//var test_webpack_file = __dirname + '/tests.webpack.js';
//var preprocessor = {};
//preprocessor[test_webpack_file] = ['webpack', 'sourcemap'];

var files = path.resolve(cwd, './test/**/*-test.js');
console.log(files);
var preprocessor = {};
preprocessor[files] = ['webpack', 'sourcemap'];

module.exports = function (config) {
  config.set({

    basePath: '.',

    browsers: ['PhantomJS'],

    singleRun: true,

    frameworks: ['mocha'],

    files: [
      // files
      './phantomjs-polyfill.js',
      './tests.webpack.js'
    ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-phantomjs-launcher"),
      //require("karma-chrome-launcher"),
      require('karma-coverage')
    ],

    reporters: ['mocha', 'coverage'],

    //preprocessors: preprocessor,
    preprocessors: {
      './tests.webpack.js': ['webpack', 'sourcemap']
      //'test/*-test.js': ['webpack'],
      //'test/**/*-test.js': ['webpack']
    },

    coverageReporter: {
      dir : path.join(cwd, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
      ],
      //instrumenters: { isparta : require('isparta') },
      //instrumenter: {
      //  '**/*.js': 'isparta'
      //},
    },

    // TODO 替换 webpack 配置, 本地先写测试
    webpack: {
      devtool: 'inline-source-map',
      //output: {
        // path: path.join(process.cwd(), './build/'),
      //  path: 'build',
      //  filename: 'test.js'
      //},
      module: {
        //loaders: [
        //  { test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
        //]
        isparta: {
          embedSource: true,
          noAutoWrap: true,
          babel: {
            presets: ['es2015', 'react']
          }
        },
        preLoaders: [
          {
            test: /\.js$/,
            exclude: [/node_modules/, path.join(cwd, 'src')],
            loader: 'babel-loader'
          },
          {
            test: /\.js$/,
            include: path.join(cwd, 'src'),
            loader: 'isparta'
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }

  });
};

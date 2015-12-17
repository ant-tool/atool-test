var path = require('path');
var cwd = process.cwd();
var getWebpackCommonConfig = require('atool-build/lib/getWebpackCommonConfig');
var webpack = require('webpack');

var webpackConfig = getWebpackCommonConfig({
  cwd: cwd
});

webpackConfig.devtool = 'inline-source-map';

webpackConfig.plugins.push(
  new webpack.ProgressPlugin(function(percentage, msg) {
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

// TODO 测试覆盖率
//webpackConfig.module.loaders.push(
//  { test: /\.jsx?$/, include:/src/, loader: 'isparta' }
//)

var base_test_dir = 'test';
var testArgs = process.argv.slice(4);
var testParam = testArgs.indexOf('--test-dir');
if (testParam > -1) {
  base_test_dir = testArgs[testParam + 1];
}

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

    coverageReporter: {
      dir : path.join(cwd, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
      ],
      instrumenters: {
        isparta : require('isparta')
      },
      instrumenter: {
        '/Users/silentcloud/Desktop/atool-test-testing/src/**/*.js': 'isparta'
      },
    },

    webpack: webpackConfig,
    /* webpack: {
      devtool: 'inline-source-map',
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
    },*/

    webpackServer: {
      noInfo: true
    }

  });
};

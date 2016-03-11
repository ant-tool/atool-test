'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _webpack = require('atool-build/lib/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getTestWebpackCfg = require('./getTestWebpackCfg');

var _getTestWebpackCfg2 = _interopRequireDefault(_getTestWebpackCfg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpackConfig = void 0;

exports.default = {
  'middleware.before': function middlewareBefore() {
    var _this = this;

    webpackConfig = (0, _getTestWebpackCfg2.default)(this.query.assert);
    webpackConfig.plugins.push(new _webpack.ProgressPlugin(function (percentage, msg) {
      var stream = process.stderr;
      if (stream.isTTY && percentage < 0.71 && _this.get('__ready')) {
        stream.cursorTo(0);
        stream.write('📦   ' + msg);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('\nwebpack: bundle build is now finished.');
      }
    }));
  },
  'middleware': function middleware() {
    var compiler = (0, _webpack2.default)(webpackConfig);
    this.set('compiler', compiler);
    compiler.plugin('done', function (stats) {
      if (stats.hasErrors()) {
        console.log(stats.toString({
          colors: true
        }));
      }
    });
    return require('koa-webpack-dev-middleware')(compiler, (0, _objectAssign2.default)({
      publicPath: '/tests',
      quiet: true
    }, this.query));
  }
};
module.exports = exports['default'];
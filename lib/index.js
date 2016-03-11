'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config, callback) {
  var _this = this;

  (0, _dora2.default)((0, _objectAssign2.default)({}, config, {
    plugins: [(0, _path.join)(__dirname, './build?assert=' + config.assert)]
  }), function () {
    var url = 'http://127.0.0.1:' + config.port + '/tests/runner.html';
    var mochaPhantomBin = (0, _path.join)(require.resolve('mocha-phantomjs'), '../../bin/mocha-phantomjs');
    var hook = (0, _path.join)(__dirname, './coverageHook.js');
    var cmds = [mochaPhantomBin + ' ' + url + '?cov --hooks ' + hook];
    var istanbulBin = (0, _path.join)(require.resolve('istanbul'), '../../.bin/istanbul');

    cmds.push(istanbulBin + ' report lcov json-summary --include coverage/coverage.json');

    _exeq2.default.apply(_this, cmds).then(function () {
      console.log();
      console.log((0, _chalk.yellow)('  Testing on http://127.0.0.1:' + config.port + '/tests/runner.html'));
      var summaryFile = (0, _path.join)(cwd, 'coverage/coverage-summary.json');
      if (_fs2.default.existsSync(summaryFile)) {
        console.log();
        var covJSON = require(summaryFile);
        for (var file in covJSON) {
          if (covJSON.hasOwnProperty(file)) {
            console.log('    ' + _path2.default.relative(process.cwd(), file) + ': ' + (0, _chalk.green)(covJSON[file].lines.pct + '% ') + (0, _chalk.gray)('coverage ') + (0, _chalk.green)(covJSON[file].lines.covered.toString()) + (0, _chalk.gray)(' lines covered '));
          }
        }
        console.log();
        console.log((0, _chalk.cyan)('  You can see more detail in coverage/report-html/index.html'));
        console.log();
      }
    }).catch(function (err) {
      callback(err.code);
    });
  });
};

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dora = require('dora');

var _dora2 = _interopRequireDefault(_dora);

var _exeq = require('exeq');

var _exeq2 = _interopRequireDefault(_exeq);

var _chalk = require('chalk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();

module.exports = exports['default'];
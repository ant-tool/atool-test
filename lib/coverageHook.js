'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  afterEnd: function afterEnd(reporter) {
    var coverage = reporter.page.evaluate(function () {
      return window.__coverage__;
    });
    if (coverage) {
      _fs2.default.write('coverage/coverage.json', JSON.stringify(coverage), 'w');
    }
  }
};
module.exports = exports['default'];
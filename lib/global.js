'use strict';

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('expect.js');
var doc = _jsdom2.default.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;

global.document = doc;
global.window = win;
global.expect = expect;

for (var key in win) {
  if (!win.hasOwnProperty(key)) {
    continue;
  }
  if (key in global) {
    continue;
  }
  global[key] = win[key];
}
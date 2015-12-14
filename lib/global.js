var expect = require('expect.js');
var jsdom = require('jsdom');
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;

global.document = doc;
global.window = win;
global.expect = expect;

for (var key in win) {
  if (!win.hasOwnProperty(key)){
    continue;
  }
  if (key in global){
    continue;
  }
  global[key] = win[key];
}
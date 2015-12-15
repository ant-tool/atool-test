import jsdom from 'jsdom';
const expect = require('expect.js');
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.expect = expect;

for (const key in win) {
  if (!win.hasOwnProperty(key)) {
    continue;
  }
  if (key in global) {
    continue;
  }
  global[key] = win[key];
}

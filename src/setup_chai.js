const chai = require('chai');

global.expect = chai.expect;
// https://github.com/chaijs/chai/issues/107
global.should = undefined;
global.should = chai.should();

global.sinon = require('sinon/pkg/sinon');

require('sinon-chai');

require('babel-polyfill');

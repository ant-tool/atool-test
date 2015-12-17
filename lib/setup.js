/**
 * some useful test helpers.
 */

// TODO 用于集成一些常用库,函数封装等

//require('./setup/sandbox.js');

global.expect = require('expect.js');
global.TestUtils = require('react-addons-test-utils');

// TODO 待解决webpack打包enzyme问题
// airbnb enzyme [https://github.com/airbnb/enzyme]
//global.shadow = require('enzyme').shadow;
//global.render = require('enzyme').render;
//global.mount = require('enzyme').mount;
// ... 待加

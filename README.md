# atool-test

[![NPM version](https://img.shields.io/npm/v/atool-test.svg?style=flat)](https://npmjs.org/package/atool-test)
[![Build Status](https://img.shields.io/travis/ant-tool/atool-test.svg?style=flat)](https://travis-ci.org/ant-tool/atool-test)
[![Coverage Status](https://img.shields.io/coveralls/ant-tool/atool-test.svg?style=flat)](https://coveralls.io/r/ant-tool/atool-test)

Simple configuration, focus more on the writing tests.

## Built-in

- [mocha](http://mochajs.org/)
- [chai](http://chaijs.com/api)
- [sinon](http://sinonjs.org/)

## Usage

>  Add `-test.js` or `-spec.js` suffix with your test files

```
"srcipts": {
  "test": "atool-test"
}
```

with options:

```
atool-test --port 9888 --no-chai --no-coverage --keep
```

## Options

- `-p, --port`: server port, default is 9876;
- `--no-coverage`: without coverage output;
- `--no-chai`: run test without chai;
- `-k, --keep`: keep process after tests, for browser test;
- `--config <path>`: custom config path, default is webpack.config.js';

## Custom Assert

>  atool-test --no-chai

- expectjs: `npm install expect.js --save-dev`
- shouldjs: `npm install should --save-dev`

```
// test code
import expect from 'expect.js';
```

## Part Of Files

If you want to test with part of files, custom `cwd/webpack.config.js`:

```
module.exports = function(webpackConfig) {
  webpackConfig.entry = ['./tests/moduleA-test.js', './tests/**/*-spec.js'];
  return webpackConfig;
};
```

support glob files;

## Html Extra Files

custom `cwd/webpack.config.js`:

```
module.exports = function(webpackConfig) {
  webpackConfig.htmlWebpackPlugin = {
    files: {
      js: ['xx.js'],
      css: ['xx.css']
    }
  };
  return webpackConfig;
};
```
base file path: `/tests`


## Browser Test & Debug

  Run with `--keep && --no-coverage` option, open `http://127.0.0.1:${port}/tests/runner.html` in your browser.


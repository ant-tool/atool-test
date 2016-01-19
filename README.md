# atool-test

[![NPM version](https://img.shields.io/npm/v/atool-test.svg?style=flat)](https://npmjs.org/package/atool-test)
[![Build Status](https://img.shields.io/travis/ant-tool/atool-test.svg?style=flat)](https://travis-ci.org/ant-tool/atool-test)
[![Coverage Status](https://img.shields.io/coveralls/ant-tool/atool-test.svg?style=flat)](https://coveralls.io/r/ant-tool/atool-test)
[![NPM downloads](http://img.shields.io/npm/dm/atool-test.svg?style=flat)](https://npmjs.org/package/atool-test)

## 特性

- 基于 karma 实现, 运行测试于浏览器端;
- 内置 es2015, react, stage-0;
- 默认内置 mocha, chai, sinon 常用测试工具类库;
- 方便的将工具迁移为 atool-test;
- 更专注于写测试用例本身;

## 全局API

- [mocha](http://mochajs.org/)
- [chai](http://chaijs.com/api)
- [sinon](http://sinonjs.org/)

## 使用

> 约定: 测试文件的文件名加 -test

```
"srcipts": {
  "test": "atool-test"
}

```

##  参数

- `--port`: 指定服务端口, 默认 9876;
- `--browsers`: 指定浏览器测试, 逗号分隔, 默认提供 `PhantomJS`, 扩展见 **指定浏览器和断言库**  说明;
- `--assert`: 指定断言库 <expectjs、shouldjs、chaijs(默认)>

## 指定浏览器和断言库

### 浏览器:
>  atool-test --browsers Chrome,Firefox

- Chrome: `npm install karma-chrome-launcher --save-dev`
- Firefox: `npm install karma-firefox-launcher --save-dev`
- IE: `npm install karma-ie-launcher --save-dev`
- Safari: `npm install karma-safari-launcher --save-dev`

### 断言库:
>  atool-test --assert expectjs

- expectjs: `npm install karma-sinon-expect --save-dev`
- shouldjs: `npm install karma-should-sinon karma-should karma-sinon --save-dev`


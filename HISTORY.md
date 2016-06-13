# History

## 0.4.13

- runner.html 增加额外 js、css 文件支持

## 0.4.12

- 指定测试文件支持 glob 形式文件 [#16](https://github.com/ant-tool/atool-test/issues/16);

## 0.4.11

- 支持指定测试文件, 配置 webpack.config.js 的 entry = [...];

## 0.4.10
- `--no-coverage & --keep`: 参数支持，方便基于测试代码进行浏览器端调试；
- `--config <path>`: 自定义 webpack config 文件名支持;
- test 支持动态增加测试文件;
- 启动测试 server，忽略用例报错；
- 地址重定向：127.0.0.1:9876 重定向到 127.0.0.1/tests/runner.html；

## ~0.4.9

server 更改为基于 dora

## 0.3.x
基于 karma 实现，内置 sinon, chai, mocha

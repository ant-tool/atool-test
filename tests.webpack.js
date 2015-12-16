// 此文件运行于浏览器上
// 运行环境为浏览器环境

// TODO 测试目录
var context = require.context('/Users/silentcloud/Desktop/atool-test-testing/test', true, /-test\.js$/);
context.keys().forEach(context);

// TODO 根据coverage watch 等生成对应配置

module.exports = function(config) {
  return {
    basePath: '.',

    frameworks: ['mocha'],

    files: [],

    reporters: ['mocha'],

    browsers: [],

    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: false
  };
};


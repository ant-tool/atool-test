import assign from 'object-assign';
import webpack, { ProgressPlugin } from 'atool-build/lib/webpack';
import getTestWebpackCfg from './getTestWebpackCfg';

let webpackConfig;

export default {
  'middleware.before'() {
    const { chai, coverage} = this.query;
    webpackConfig = getTestWebpackCfg(chai, coverage);
    webpackConfig.plugins.push(
      new ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71 && this.get('__ready')) {
          stream.cursorTo(0);
          stream.write(`📦   ${msg}`);
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log('\nwebpack: bundle build is now finished.');
        }
      })
    );
  },

  'middleware'() {
    const compiler = webpack(webpackConfig);
    this.set('compiler', compiler);
    compiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.log(stats.toString({
          colors: true,
        }));
      }
    });
    return require('koa-webpack-dev-middleware')(compiler, assign({
      publicPath: '/tests',
      quiet: true,
    }, this.query));
  },
};

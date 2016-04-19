import webpack, { ProgressPlugin } from 'atool-build/lib/webpack';
import getTestWebpackCfg from './getTestWebpackCfg';
import chokidar from 'chokidar';
import { join } from 'path';

let webpackConfig;

export default {
  'middleware.before'() {
    const { chai, coverage, config } = this.query;
    webpackConfig = getTestWebpackCfg(chai, coverage, config);
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
    return require('koa-webpack-dev-middleware')(compiler, {
      publicPath: '/tests',
      quiet: true
    });
  },

  'server.after'() {
    const { cwd, query } = this;
    const webpackConfigPath = join(cwd, query.config);
    chokidar.watch(webpackConfigPath).on('change', () => {
      this.restart();
    });

    chokidar.watch(['**/*-test.js', '**/*-spec.js'], {
      ignored: /node_modules/,
      ignoreInitial: true
    }).on('add', (path) => {
      console.log();
      console.log(`atool-test: File ${path} has been added, restart...`);
      process.send('restart');
    }).on('unlink', (path) => {
      console.log();
      console.log(`atool-test: File ${path} has been removed, restart...`);
      process.send('restart');
    });
  }
};

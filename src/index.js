import assign from 'object-assign';
import path, { join } from 'path';
import fs from 'fs';
import server from 'dora';
import exeq from 'exeq';
import { green, gray, cyan, yellow } from 'chalk';

const cwd = process.cwd();

export default function(config) {
  server(assign({}, config, {
    plugins: [
      join(__dirname, `./build?chai=${config.chai}&coverage=${config.coverage}&config=${config.config}`),
      join(__dirname, './rewrite'),
    ],
  }), () => {
    const url = `http://127.0.0.1:${config.port}/tests/runner.html`;
    let mochaPhantomBin = join(__dirname, '../node_modules/.bin/mocha-phantomjs');
    if (!fs.existsSync(mochaPhantomBin)) {
      mochaPhantomBin = join(require.resolve('mocha-phantomjs'), '../../../.bin/mocha-phantomjs');
    }
    const cmds = [];
    const mochaPhantomOpts = config.args.join(' ');
    if (config.coverage) {
      const hook = join(__dirname, './coverageHook.js');
      cmds.push([`${mochaPhantomBin} --ignore-resource-errors ${mochaPhantomOpts} ${url}?cov --hooks ${hook}`]);
      const istanbulBin = require.resolve('istanbul/lib/cli.js');
      cmds.push(`node ${istanbulBin} report lcov json-summary --include coverage/coverage.json`);
    } else {
      cmds.push([`${mochaPhantomBin} ${mochaPhantomOpts} --ignore-resource-errors ${url}`]);
    }

    exeq.apply(this, cmds).then(() => {
      console.log();
      if (config.keep) {
        console.log(yellow(`  Testing on http://127.0.0.1:${config.port}/tests/runner.html`));
      }

      if (config.coverage) {
        const summaryFile = join(cwd, 'coverage/coverage-summary.json');
        if (fs.existsSync(summaryFile)) {
          console.log();
          const covJSON = require(summaryFile);
          for (const file in covJSON) {
            if (covJSON.hasOwnProperty(file)) {
              console.log('    ' + path.relative(process.cwd(), file) + ': ' +
                green(covJSON[file].lines.pct + '% ') + gray('coverage ') +
                green(covJSON[file].lines.covered.toString()) + gray(' lines covered ')
              );
            }
          }
          console.log();
          console.log(cyan('  You can see more detail in coverage/lcov-report/index.html'));
          console.log();
        }
      }

      if (!config.keep) process.exit(0);
    }).catch((err) => {
      if (!config.keep) process.exit(err.code);
    });
  });
}

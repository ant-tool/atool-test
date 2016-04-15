import assign from 'object-assign';
import path, { join } from 'path';
import fs from 'fs';
import server from 'dora';
import exeq from 'exeq';
import { green, gray, cyan, yellow } from 'chalk';

const cwd = process.cwd();

export default function(config, callback) {
  server(assign({}, config, {
    plugins: [
      join(__dirname, `./build?chai=${config.chai}&coverage=${config.coverage}`),
    ],
  }), () => {
    const url = `http://127.0.0.1:${config.port}/tests/runner.html`;
    const mochaPhantomBin = join(require.resolve('mocha-phantomjs'), '../../bin/mocha-phantomjs');

    const cmds = [];
    if (config.coverage) {
      const hook = join(__dirname, './coverageHook.js');
      cmds.push([`${mochaPhantomBin} ${url}?cov --hooks ${hook}`]);
      const istanbulBin = require.resolve('istanbul/lib/cli.js');
      cmds.push(`node ${istanbulBin} report lcov json-summary --include coverage/coverage.json`);
    } else {
      cmds.push([`${mochaPhantomBin} ${url}`]);
    }

    exeq.apply(this, cmds).then(() => {
      console.log();
      config.keep && console.log(yellow(`  Testing on http://127.0.0.1:${config.port}/tests/runner.html`));

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

      if (!config.keep) callback(0);

    }).catch((err) => {
      callback(err.code);
    });
  });
}

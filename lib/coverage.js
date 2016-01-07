var fs = require('fs');
var path = require('path');
var cwd = process.cwd();

var summary_file = path.join(cwd, 'coverage/json-summary.json');

if (fs.existsSync(summary_file)) {

  var chalk = require('chalk');
  var green = chalk.green;
  var gray = chalk.gray;
  var cyan = chalk.cyan;

  console.log();

  var covJSON = require(summary_file);

  for (file in covJSON) {
    console.log('    ' + path.relative(process.cwd(), file) + ': ' +
      green(covJSON[file].lines.pct + '% ') + gray('coverage ') +
      green(covJSON[file].lines.covered.toString()) + gray(' lines covered ')
    );
  }
  console.log();
  console.log(cyan('  You can see more detail in ' + 'coverage/report-html/index.html'));
  console.log();
}
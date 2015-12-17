var path = require('path');
var chalk = require('chalk');
var cwd = process.cwd();
var green = chalk.green;
var gray = chalk.gray;
var cyan = chalk.cyan;

console.log();

var covJSON = require(path.join(cwd, 'coverage/json-summary.json'));

var summary = {
  lines: {total: 0, covered: 0},
  statements: {total: 0, covered: 0},
  functions: {total: 0, covered: 0},
  branches: {total: 0, covered: 0}
};

for (var file in covJSON) {
  ['lines', 'statements', 'functions', 'branches'].forEach(function (key) {
    summary[key].total += covJSON[file][key].total;
    summary[key].covered += covJSON[file][key].covered;
  });
}

var percentage = Math.round(100 * summary.lines.covered / summary.lines.total) + '%';

if (summary.lines.total === 0) {
  percentage = '0%';
}

console.log('  ' + green(percentage) + ' coverage, ' +
  green(summary.lines.covered.toString()) + ' lines covered');

for (file in covJSON) {
  console.log('    ' + gray(path.relative(process.cwd(), file)) + ': ' +
    green(covJSON[file].lines.pct + '% ') + gray('coverage ') +
    green(covJSON[file].lines.covered.toString()) + gray(' lines covered ')
  );
}
console.log(cyan('  You can see more detail in ' + 'coverage/report-html/index.html'));
console.log();
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import runSequence from 'run-sequence';
import path from 'path';

const cwd = process.cwd();

require('babel-core/register');

const TEST_FILES = [path.join(cwd, 'test/**/*.js'), path.join(cwd, 'test/**/*.jsx')];
const SRC_FILES = [path.join(cwd, 'src/**/*.js'), path.join(cwd, 'src/**/*.jsx')];

function defineTasks() {
  gulp.task('test', () => {
    return gulp.src(TEST_FILES, { read: false })
      .pipe(mocha({
        require: [__dirname + '/global'],
      }));
  });

  gulp.task('coverage:instrument', () => {
    return gulp.src(SRC_FILES)
      .pipe(istanbul({
        instrumenter: require('isparta').Instrumenter,
      }))
      .pipe(istanbul.hookRequire());
  });

  gulp.task('coverage:report', () => {
    return gulp.src(SRC_FILES, { read: false })
      .pipe(istanbul.writeReports({
        dir: path.join(cwd, 'coverage'),
        reporters: ['lcov', 'json', 'text', 'text-summary', 'html'],
      }));
  });

  gulp.task('test:coverage', (done) => {
    runSequence('coverage:instrument', 'test', 'coverage:report', done);
  });
}

export function test() {
  defineTasks();
  gulp.start('test:coverage');
}

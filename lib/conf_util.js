var path = require('path');
var cwd = process.cwd();

var confUtil = {
  getValueFromArgv: function(argv, param) {
    if (argv && param) {
      var index = argv.indexOf(param);
      return index > -1 ? argv[index + 1] : null;
    }
    return null;
  },
  getFrameworks: function(assert) {
    var frameworks = [];
    switch (assert) {
      case 'expectjs':
        frameworks = ['mocha', 'sinon-expect'];
        break;
      case 'shouldjs':
        frameworks = ['mocha', 'should-sinon', 'should', 'sinon'];
        break;
      default:
        frameworks = ['mocha', 'sinon-chai'];
        break;
    }
    return frameworks;
  },
  getBrowserLauncherPlugins: function(browsers) {
    if(!browsers || browsers.length === 0 || browsers[0] === 'PhantomJS') {
      return [require('karma-phantomjs-launcher')];
    }
    var browsersMap = {
      'Chrome': 'karma-chrome-launcher',
      'Firefox': 'karma-firefox-launcher',
      'Safari': 'karma-safari-launcher',
      'IE': 'karma-ie-launcher'
    };
    var plugins = [];
    browsers.forEach(function(item) {
      if (browsersMap[item]) {
        plugins.push(
          require.resolve(path.join(cwd, 'node_modules/' + browsersMap[item]))
        )
      }
    });
    return plugins;
  },
  getAssertLibraryPlugin: function(assert) {
    var assertPlugin = [];
    switch (assert) {
      case 'expectjs':
        assertPlugin = [require.resolve(path.join(cwd, 'node_modules/karma-sinon-expect'))];
        break;
      case 'shouldjs':
        assertPlugin = [
          require.resolve(path.join(cwd, 'node_modules/karma-should-sinon')),
          require.resolve(path.join(cwd, 'node_modules/karma-should')),
          require.resolve(path.join(cwd, 'node_modules/karma-sinon'))
        ];
        break;
      default:
        assertPlugin = [require('karma-sinon-chai')];
        break;
    }
    return assertPlugin;
  }
};

module.exports = confUtil;



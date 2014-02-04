var librariesCombineFiles = require('../libraries-combine-files');
var uiTestingCombineFiles = require('../ui-testing-combine-files');
var applicationCombineFiles = require('../application-combine-files');

module.exports = {
  path: '<%= globalConfig.webRoot %>',
  buildPath: 'build',
  combineAssets: {
    default: {
      'app/build/libraries.js': librariesCombineFiles,
      'app/build/application.js': applicationCombineFiles
    },
    uiTesting: {
      'app/build/libraries.js': librariesCombineFiles,
      'app/build/application.js': applicationCombineFiles,
      'app/build/ui-testing.js': uiTestingCombineFiles
    }
  },
  rewriteAssets: {
    fileTypes: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css']/*,
     prependSlash: true,
     //use multiple domains
     domains: [
     'http://static1.exmaple.com',
     'http://static2.exmaple.com'
     ],
     use single domain
     domains: 'http://static.example.com'*/
  }
};
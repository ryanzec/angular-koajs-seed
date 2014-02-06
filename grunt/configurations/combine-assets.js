var librariesCombineFiles = require('../libraries-combine-files');
var uiTestingCombineFiles = require('../ui-testing-combine-files');
var applicationCombineFiles = require('../application-combine-files');

module.exports = {
  webRootPath: '<%= globalConfig.webRoot %>',
  buildPath: 'build',
  default: {
    'app/build/libraries.js': librariesCombineFiles,
    'app/build/application.js': applicationCombineFiles
  },
  uiTesting: {
    'app/build/libraries.js': librariesCombineFiles,
    'app/build/application.js': applicationCombineFiles,
    'app/build/ui-testing.js': uiTestingCombineFiles
  }
};
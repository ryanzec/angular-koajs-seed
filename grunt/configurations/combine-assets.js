var librariesCombineFiles = require('../libraries-combine-files');
var uiTestingCombineFiles = require('../ui-testing-combine-files');
var applicationCombineFiles = require('../application-combine-files');

//todo: look at replace app with globalConfig
module.exports = {
  webPath: '<%= globalConfig.webPath %>',
  default: {
    'app/build/libraries.js': librariesCombineFiles,
    'app/build/application.js': applicationCombineFiles,
    'app/build/ui-testing.js': uiTestingCombineFiles
  }
};
var bowerCopyFiles = require('../bower-copy-files');

module.exports = {
  options: {
    srcPrefix: 'bower_components',
    clean: true
  },
  default: {
    options: {
      destPrefix: '<%= globalConfig.webPath %>/components'
    },
    files: bowerCopyFiles
  }
};
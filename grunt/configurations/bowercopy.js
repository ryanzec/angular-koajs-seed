var bowerCopyFiles = require('../bower-copy-files');

module.exports = {
  options: {
    srcPrefix: 'bower_components'
  },
  default: {
    options: {
      destPrefix: 'web/components'
    },
    files: bowerCopyFiles
  }
};
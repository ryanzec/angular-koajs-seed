module.exports = {
  webPath: '<%= globalConfig.webPath %>',
  options: {
    destDir: '<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>'
  },
  htmlOptions: {
    test: true
  },
  default: {
    files: {
      '*.html': '',
      'app/components/**/*.html': '',
      'components/**/*.html': ''
    }
  }
};
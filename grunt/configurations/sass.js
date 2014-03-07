module.exports = {
  dist: {
    options: {
      sourcemap: true
    },
    files: {
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>/main.css': [
        '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/styles/main.scss'
      ]
    }
  }
};
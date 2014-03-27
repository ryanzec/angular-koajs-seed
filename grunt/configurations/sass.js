module.exports = {
  dist: {
    options: {
      sourcemap: true
      quiet: true,
      style: 'compressed'
    },
    files: {
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>/main.css': [
        '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/styles/main.scss'
      ]
    }
  }
};

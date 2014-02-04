module.exports = {
  dist: {
    options: {
      sourcemap: true
    },
    files: {
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/styles/main.css': [
        '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/styles/main.scss'
      ]
    }
  }
};
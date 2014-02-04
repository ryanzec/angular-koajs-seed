module.exports = {
  //these value should ensure no error as these settings are just for reference (to compare maintainability of the difference piece of code)
  reference: {
    src: [
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/application.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/misc/**/*.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/models/**/*.js'
    ],
    options: {
      cyclomatic: 10,
      halstead: 20,
      maintainability: 80
    }
  },
  defaults: {
    src: [
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/application.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/misc/**/*.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.js',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/models/**/*.js'
    ]
  }
};
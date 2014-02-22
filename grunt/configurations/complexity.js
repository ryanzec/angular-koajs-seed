module.exports = {
  //these value should ensure no error as these settings are just for reference (to compare maintainability of the difference piece of code)
  reference: {
    src: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/application.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/misc/**/*.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/components/**/*.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/models/**/*.js'
    ],
    options: {
      cyclomatic: 10,
      halstead: 20,
      maintainability: 80
    }
  },
  defaults: {
    src: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/application.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/misc/**/*.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/components/**/*.js',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/models/**/*.js'
    ]
  }
};
var globalConfig = require('../global-config');

module.exports = {
  app: {
    src: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>//**/*.html',
      '<%= globalConfig.webPath %>/components/nucleus-angular*/assets/templates/**/*.html',
    ],
    dest: '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/templates.js',
    options: {
      module: 'app',
      url: function(a) {
        console.log(a.replace(globalConfig.webPath + '/', ''));
        return a.replace(globalConfig.webPath + '/', '');
      },
      htmlmin: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes:  true
      }
    }
  }
};

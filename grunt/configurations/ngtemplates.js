var globalConfig = require('../global-config');

module.exports = {
  app: {
    src: [
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/**/*.html'
    ],
    dest: '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/templates.js',
    options: {
      module: 'app',
      url: function(a) {
        console.log(a.replace(globalConfig.webRoot + '/', ''));
        return a.replace(globalConfig.webRoot + '/', '');
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
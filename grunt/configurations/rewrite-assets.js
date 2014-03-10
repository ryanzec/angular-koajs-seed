module.exports = function(grunt) {
  return {
    webPath: '<%= globalConfig.webPath %>',
    fileTypes: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css'],
    prependSlash: true,
    alwaysRewrite: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>/index.html',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>/index-ut.html'
    ],
    default: [
      '<%= globalConfig.webPath %>/index.html',
      '<%= globalConfig.webPath %>/index-ut.html',
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/<%= globalConfig.buildPath %>/**/*.*'
      //add these is you wish to serve html from KoaJS
      //'<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/app/**/*.html',
      //'<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/components/**/*.html'
    ]
    //use multiple domains
    /*domains: [
      'http://static1.exmaple.com',
      'http://static2.exmaple.com'
    ],*/
    //use single domain
    /*domains: 'http://static.example.com'*/
  };
};

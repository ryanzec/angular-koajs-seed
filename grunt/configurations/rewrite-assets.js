var librariesCombineFiles = require('../libraries-combine-files');
var uiTestingCombineFiles = require('../ui-testing-combine-files');
var applicationCombineFiles = require('../application-combine-files');

module.exports = function(grunt) {
  return {
    webRootPath: '<%= globalConfig.webRoot %>',
    appRootPath: 'app',
    fileTypes: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css'],
    prependSlash: true,
    default: [
      '<%= globalConfig.webRoot %>/index.html',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/<%= globalConfig.buildPath %>/**/*'
      //add these is you wish to serve html from KoaJS
      //'<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/app/**/*.html',
      //'<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.html'
    ],
    uiTesting: [
      '<%= globalConfig.webRoot %>/index-ut.html',
      '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/<%= globalConfig.buildPath %>/**/*'
      //add these is you wish to serve html from KoaJS
      //'<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/app/**/*.html',
      //'<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.html'
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
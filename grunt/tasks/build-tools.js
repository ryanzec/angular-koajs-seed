var path = require('path');
var buildMetaData = require('../build-meta-data')();

module.exports = function(grunt){
  var rootDirectory = path.dirname(grunt.file.findup('Gruntfile.{js,coffee}', {nocase: true}));
  buildMetaData.initialize(rootDirectory + '/build-meta-data.json');
  
  return {
    combineAssets: require('./combine-assets')(grunt, buildMetaData),
    rewriteAssets: require('./rewrite-assets')(grunt, buildMetaData),
    htmlMinifier: require('./html-minifier')(grunt, buildMetaData)
  };
};
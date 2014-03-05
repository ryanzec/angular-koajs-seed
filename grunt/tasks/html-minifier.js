var fs = require('fs');
var minify = require('html-minifier').minify;
var glob = require('glob');
var lingo = require('lingo');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');
var colors = require('colors');

module.exports = function(grunt, buildMetaData){
  var rootDirectory = path.dirname(grunt.file.findup('Gruntfile.{js,coffee}', {nocase: true}));

  return function() {
    buildMetaData.updateFromFile();

    var combineType = this.args[0] || 'default';
    var config = grunt.config.get('htmlMinifier');
    var targetConfig = config[lingo.camelcase(combineType.replace('-', ' '))];
    var options = config.options || {};
    var htmlMinifierOptions = config.htmlOptions || {};
    
    htmlMinifierOptions = _.extend({
      collapseWhitespace: true,
      removeComments: true
    }, htmlMinifierOptions);

    if(targetConfig.options) {
      _.extend(options, targetConfig.options);
    }

    if(targetConfig.htmlOptions) {
      _.extend(htmlMinifierOptions, targetConfig.htmlOptions);
    }

    _.forEach(targetConfig.files, function(destination, source) {
      source = glob.sync(config.webPath + '/' + source);

      if(source.length > 0) {
        //if the glob matches multiple files, then the destination will match the file name
        if(source.length > 1) {
          destination = '';
        }

        var changeFiles =[];
        source.forEach(function(file) {
          if(buildMetaData.hasChangedFile([file], rootDirectory) === true) {
            changeFiles.push(file);
          }
        });
        source = changeFiles;

        source.forEach(function(filePath) {
          var fileContents = fs.readFileSync(filePath, 'ascii');
          var minContents = minify(fileContents, htmlMinifierOptions);

          if(destination === '') {
            destination = filePath.replace(config.webPath + '/', '');
          }

          if(options.destDir) {
            destination = config.webPath + '/' + options.destDir + '/' + destination;
          } else {
            destination = config.webPath + '/' + destination;
          }

          //make sure the directory exists
          if(!fs.existsSync(path.dirname(destination))) {
            mkdirp.sync(path.dirname(destination));
          }

          console.log(('writing out minified html file: ' + destination).green);
          fs.writeFileSync(destination, minContents, 'ascii');
          buildMetaData.addBuildMetaDataFile(filePath);
          destination = '';
        });
      }
    });

    buildMetaData.writeFile();
  };
};

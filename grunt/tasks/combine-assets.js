var fs = require('fs');
var glob = require('glob');
var colors = require('colors');
var uglifyjs = require('uglify-js');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');
var _ = require('lodash');
var lingo = require('lingo');

module.exports = function(grunt, buildMetaData){
  var rootDirectory = path.dirname(grunt.file.findup('Gruntfile.{js,coffee}', {nocase: true}));

  return function() {
    buildMetaData.updateFromFile();
    //when deleting build files, lets not delete these
    var dontDeleteFiles = ['.svn', '.git', '.gitignore', '.gitkeep'];
    var combineType = this.args[0] || 'default';
    var config = grunt.config.get('combineAssets');

    function buildJavascriptFiles(files, destinationFile, excludeList) {
      function buildCompiledFile(files, destinationFile, originalFileName) {
        if(!buildMetaData.hasWorkingFiles() && fs.existsSync(path.dirname(destinationFile))) {
          var items = fs.readdirSync(path.dirname(destinationFile));

          for(var z = 0; z < items.length; z += 1) {
            if(dontDeleteFiles.indexOf(items[z]) === -1) {
              console.log(('removing file ' + path.dirname(destinationFile) + '/' + items[z]).yellow);
              rimraf.sync(path.dirname(destinationFile) + '/' + items[z]);
            }
          }
        }

        buildMetaData.resetCompiledFileList(destinationFile);

        //need to update the build meta data
        var fileList = [];
        files.forEach(function(filePath){
          fileList.push(filePath.replace(rootDirectory + '/', ''));
          buildMetaData.addBuildMetaDataFile(path.relative(rootDirectory, filePath), destinationFile);
        });

        var sourceMapFileName = originalFileName + '.map';
        var sourceMapDestination = rootDirectory  + "/" + config.webPath + '/source/' + sourceMapFileName;

        //make sure source maps directory exists
        if(!fs.existsSync(path.dirname(sourceMapDestination))) {
          mkdirp.sync(path.dirname(sourceMapDestination));
        } else {
          rimraf.sync(sourceMapDestination);
        }

        //make sure build directory exists
        if(!fs.existsSync(path.dirname(destinationFile))) {
          mkdirp.sync(path.dirname(destinationFile));
        } else {
          rimraf.sync(destinationFile);
        }

        console.log(('combining files:\n' + fileList.join('\n') + '\n' + 'into:\n' + destinationFile + '\n').green);

        var minSource = uglifyjs.minify(fileList, {
          outSourceMap: sourceMapFileName,
          sourceRoot: '/'
        });

        //not sure the best way to do this but since grunt is executed one directory up from the web root, I have to the web root directory from the sources
        //todo: see if there is a better way to do this
        var mappingData = JSON.parse(minSource.map);
        mappingData.sources = _.map(mappingData.sources, function(path) {
          return path.replace(config.webPath + '/', '');
        });
        var mappingDataSource = JSON.stringify(mappingData);

        fs.appendFileSync(destinationFile, minSource.code + "\n" + '//# sourceMappingURL=/source/' + sourceMapFileName, 'ascii');

        console.log(('writing source map file: ' + sourceMapDestination).green);
        fs.appendFileSync(sourceMapDestination, mappingDataSource, 'ascii');
      };

      //do a glob search for all the files
      var fileMatches = [];

      files.forEach(function(search) {
        fileMatches = fileMatches.concat(glob.sync(search));
      });

      files = fileMatches;

      //do a glob search for all the files
      var excludeMatches = [];

      excludeList.forEach(function(search) {
        excludeMatches = excludeMatches.concat(glob.sync(search));
      });

      excludeList = excludeMatches;

      files = _.filter(files, function(file) {
        return excludeList.indexOf(file) === -1;
      });

      var source;
      var originalFileName = path.basename(destinationFile);
      var changedFile = buildMetaData.hasChangedFile(files, rootDirectory);
      var compiledFiles = buildMetaData.getCompiledFiles(files);

      //invalidate the compile files if the files have changed
      if(changedFile === true) {
        for(compiledFile in compiledFiles) {
          console.log(('invalidating ' + compiledFiles[compiledFile]).yellow);
          buildMetaData.invalidateBuildFile(compiledFiles[compiledFile]);
        }
      }

      var sameFiles = buildMetaData.hasSameFiles(destinationFile, files);

      if(changedFile || !sameFiles) {
        if(fs.existsSync(destinationFile)) {
          console.log(('removing file ' + destinationFile).yellow);
          rimraf.sync(destinationFile);
        }

        buildCompiledFile(files, destinationFile, originalFileName);
      } else if(!changedFile && sameFiles && !fs.existsSync(destinationFile)) {
        buildCompiledFile(files, destinationFile, originalFileName);
      } else {
        destinationFile = compiledFiles[0];
      }

      return destinationFile;
    };

    var combineAssets = config[lingo.camelcase(combineType.replace('-', ' '))];

    _.forEach(combineAssets, function(item, key) {
      //add the web root directory to the file paths
      var excludeList = item.excludeList || [];
      var files = _.map(item.files, function(path) {
        return rootDirectory + '/' + config.webPath + '/' + path;
      });
      excludeList = _.map(excludeList, function(path) {
        return rootDirectory + '/' + config.webPath + '/' + path;
      });
      
      buildJavascriptFiles(files, config.webPath + '/' + key, excludeList);
    });

    buildMetaData.writeFile();
  }
};

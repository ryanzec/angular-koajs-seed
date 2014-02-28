var fs = require('fs');
var colors = require('colors');
var path = require('path');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = (function() {
  return (function() {
    //we need to keep tracking of some meta data about the build files to be able to deteremine if we need to generate them
    var buildMetaDataFilePath = __dirname + '/build-meta-data.json';
    var currentBuildMetaData = {};
    var lastBuildMetaData = {};
    var changedFilesKeys = [];

    var buildMetaDataObject = {
      initialize: function(metaDataFilePath){
        buildMetaDataFilePath = metaDataFilePath;
        this.updateFromFile();
      },

      updateFromFile: function() {
        changedFilesKeys = [];

        if(fs.existsSync(buildMetaDataFilePath)) {
          lastBuildMetaData = JSON.parse(fs.readFileSync(buildMetaDataFilePath, 'ascii'));
        }

        if(!lastBuildMetaData['workingFiles']) {
          lastBuildMetaData['workingFiles'] = {};
        }

        if(!currentBuildMetaData['workingFiles']) {
          currentBuildMetaData['workingFiles'] = lastBuildMetaData['workingFiles'];
        }

        if(!lastBuildMetaData['buildFiles']) {
          lastBuildMetaData['buildFiles'] = {};
        }

        if(!currentBuildMetaData['buildFiles']) {
          currentBuildMetaData['buildFiles'] = lastBuildMetaData['buildFiles'];
        }

        //lets cache all the files that have changed upfront
        for(var resourcePath in currentBuildMetaData['workingFiles']) {
          if(
          currentBuildMetaData['workingFiles'][resourcePath]
          && buildMetaDataObject.getFileHash(resourcePath) !== currentBuildMetaData['workingFiles'][resourcePath].fileHash
          ) {
            changedFilesKeys.push(resourcePath);
          }
        }
      },

      invalidateBuildFile: function(file) {
        delete currentBuildMetaData['buildFiles'][file];
      },

      /**
       * Tells whether or not the any of the files in the list has a changed one
       *
       * @param files
       * @returns {*}
       */
      hasChangedFile: function(files, relativeDirectoryPath) {
        relativeDirectoryPath = relativeDirectoryPath || __dirname;

        //console.log(changedFilesKeys);

        for(var file in files) {
          if(changedFilesKeys.indexOf(path.relative(relativeDirectoryPath, files[file])) !== -1) {
            return true;
          } else if(!currentBuildMetaData['workingFiles'][path.relative(relativeDirectoryPath, files[file])]) {
            return true;
          }
        }

        return false;
      },

      /**
       * Determines if the passed in files list is the same list of files used the last time the compiled files was generated
       *
       * @param originalFileName
       * @param files
       * @returns {boolean}
       */
      hasSameFiles: function(originalFileName, files) {
        var hasSameFiles;

        if(!lastBuildMetaData['buildFiles'] || !lastBuildMetaData['buildFiles'][originalFileName]) {
          hasSameFiles = false;
        }

        for(var file in files) {
          if(
          !lastBuildMetaData['buildFiles'][originalFileName] ||
          lastBuildMetaData['buildFiles'][originalFileName].indexOf(path.relative(path.dirname(buildMetaDataFilePath), files[file])) === -1
          ) {
            hasSameFiles = false;
          }
        }

        if(hasSameFiles !== false) {
          hasSameFiles = files.length === lastBuildMetaData['buildFiles'][originalFileName].length;
        }

        //if it is not the same, remove the stored files since it will be rebuilt anyways
        if(hasSameFiles === false) {
          lastBuildMetaData['buildFiles'][originalFileName] = [];
        }

        return hasSameFiles;
      },

      /**
       * Returns all the compiled files that used the files of files during the last build
       *
       * @param files
       * @returns {Array}
       */
      getCompiledFiles: function(files) {
        var filePaths = [];

        for(file in files) {
          _.forEach(currentBuildMetaData['buildFiles'], function(fileSet, buildFile) {
            if(_.indexOf(fileSet, files[file].replace(__dirname + '/', '')) !== -1 && _.indexOf(filePaths, buildFile) === -1) {
              filePaths.push(buildFile);
            }
          });
        }

        return filePaths;
      },

      /**
       * Generates a sha1 hash of the contents of a files
       *
       * @param filePath
       * @returns {*}
       */
      getFileHash: function(filePath) {
        var shasum = crypto.createHash('sha1');

        if(fs.existsSync(filePath)) {
          return shasum.update(fs.readFileSync(filePath, 'ascii')).digest('hex');
        } else {
          return false;
        }
      },

      /**
       * Adds meta data information for the build
       *
       * @param filePath
       * @param compiledFilePath
       * @param originalFileName
       */
      addBuildMetaDataFile: function(filePath, compiledFilePath) {
        var oldFileHash = currentBuildMetaData['workingFiles'][filePath] ? currentBuildMetaData['workingFiles'][filePath].fileHash : null;
        currentBuildMetaData['workingFiles'][filePath] = {
          //a hash of the file is probably a more accurate way of determine if the file has changed than last modified datetime
          fileHash: this.getFileHash(filePath)
        };

        //need to make sure the file that are changed during a task are marked as changed for later tasks when running multiple tasks at the same time
        if(oldFileHash !== currentBuildMetaData['workingFiles'][filePath].fileHash) {
          var toAdd = [];

          if(filePath) {
            toAdd.push(filePath);
          }

          if(compiledFilePath) {
            toAdd.push(compiledFilePath);
          }

          changedFilesKeys = changedFilesKeys.concat(toAdd);

          //remove any duplicates
          changedFilesKeys = changedFilesKeys.filter(function(elem, pos) {
            return changedFilesKeys.indexOf(elem) == pos;
          });
        }

        if(compiledFilePath) {
          if(!currentBuildMetaData['buildFiles']) {
            currentBuildMetaData['buildFiles'] = {};
          }

          if(!currentBuildMetaData['buildFiles'][compiledFilePath]) {
            currentBuildMetaData['buildFiles'][compiledFilePath] = [];

            if(lastBuildMetaData['buildFiles']) {
              lastBuildMetaData['buildFiles'][compiledFilePath] = [];
            }
          }

          if(_.indexOf(currentBuildMetaData['buildFiles'][compiledFilePath], filePath) === -1) {
            currentBuildMetaData['buildFiles'][compiledFilePath].push(filePath);
          }
        }
      },

      hasWorkingFiles: function() {
        return lastBuildMetaData['workingFiles'] && Object.keys(lastBuildMetaData['workingFiles']).length > 0;
      },

      writeFile: function() {
        console.log(('writing out build meta data file ' + buildMetaDataFilePath).green);
        fs.writeFileSync(buildMetaDataFilePath, JSON.stringify(currentBuildMetaData, null, 2), 'ascii');
      }
    };

    return buildMetaDataObject;
  }());
});

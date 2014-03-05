var fs = require('fs');
var glob = require('glob');
var colors = require('colors');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var lingo = require('lingo');

var recursiveWalk = function(directory, files) {
  var files = files || [];

  fs.readdirSync(directory).forEach(function(item) {
    var fullItemPath = directory + '/' + item;

    if(fs.statSync(fullItemPath).isDirectory()) {
      recursiveWalk(fullItemPath, files);
    } else {
      files.push(fullItemPath);
    }

  });

  return files;
};

module.exports = function(grunt, buildMetaData) {
  var rootDirectory = path.dirname(grunt.file.findup('Gruntfile.{js,coffee}', {nocase: true}));

  return function() {
    buildMetaData.updateFromFile();
    var rewriteType = this.args[0] || 'default';
    var config = grunt.config.get('rewriteAssets');

    if(config) {
      function getRewriteAssetsPath(asset, fullPath) {
        var fileStats = fs.statSync(fullPath);
        var assetParts = asset.split('/');
        var spliceStart = 0;

        assetParts.splice(spliceStart, 0, 'static', moment(fileStats.mtime).unix());

        return assetParts.join('/');
      };

      var rewritableAssetExtensions = _.map(config.fileTypes, function(item) {
        return '.' + item;
      });

      var allAssets = recursiveWalk(rootDirectory + '/' + config.webPath);
      var rewriteAssets = [];

      allAssets.forEach(function(item) {
        if(rewritableAssetExtensions.indexOf(path.extname(item)) !== -1) {
          rewriteAssets.push(item);
        }
      });

      var filesToProcess = [];
      var searchFor = config[lingo.camelcase(rewriteType.replace('-', ' '))];

      searchFor.forEach(function(search) {
        filesToProcess = filesToProcess.concat(glob.sync(search));
      });

      //eliminate files that have not changed
      var changeFiles =[];
      filesToProcess.forEach(function(file) {
        if(buildMetaData.hasChangedFile([file], rootDirectory) === true || config.alwaysRewrite.indexOf(file) !== -1) {
          changeFiles.push(file);
        }
      });
      filesToProcess = changeFiles;

      var currentDomainKey = 0;
      var maxDomainKey;

      if(_.isString(config.domains)) {
        config.domains = [config.domains];
      } else if(!_.isArray(config.domains)) {
        config.domains = [];
      }

      maxDomainKey = config.domains.length - 1;

      filesToProcess.forEach(function(file) {
        //only process files
        var fileStats = fs.statSync(file)
        
        if(fileStats.isFile() !== true) {
          return;
        }

        var fileContents = fs.readFileSync(file, 'ascii');

        rewriteAssets.forEach(function(asset) {
          var fullPath = asset;
          asset = asset.replace(rootDirectory + '/' + config.webPath + '/', '');

          var regex = new RegExp('((http[s]?:)?//[a-zA-Z0-9-_.]*.[a-zA-Z0-9-_]*.[a-zA-Z0-9-_]{2,6})?/?((static/[0-9]*/)+)?' + asset, 'g');
          var rewrittenPath = getRewriteAssetsPath(asset, fullPath);

          //see if we should set the full url or just leave it as a relative path
          if(config.domains.length > 0) {
            rewrittenPath = config.domains[currentDomainKey] + '/' + rewrittenPath;

            if(maxDomainKey > 0 && currentDomainKey >= maxDomainKey) {
              currentDomainKey = 0;
            } else if(maxDomainKey > 0 && _.isArray(fileContents.match(regex))) {
              currentDomainKey += 1;
            }
          } else if(config.prependSlash !== false) {
            rewrittenPath = '/' + rewrittenPath;
          }

          fileContents = fileContents.replace(regex, rewrittenPath);
        });

        console.log(('rewriting assets in ' + file).green);
        fs.writeFileSync(file, fileContents, 'ascii');
        buildMetaData.addBuildMetaDataFile(file);
      });

      buildMetaData.writeFile();
    }
  }
};

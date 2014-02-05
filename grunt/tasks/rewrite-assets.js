var fs = require('fs');
var glob = require('glob');
var colors = require('colors');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');

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

module.exports = function(grunt) {
  var rootDirectory = path.dirname(grunt.file.findup('Gruntfile.{js,coffee}', {nocase: true}));

  return function() {
    var rewriteType = this.args[0] || 'default';
    var rewriteAssetsConfig = grunt.config.get('build').rewriteAssets;
    var globalConfig = grunt.config.get('globalConfig');

    if(rewriteAssetsConfig) {
      function getRewriteAssetsPath(asset, fullPath) {
        var fileStats = fs.statSync(fullPath);
        var assetParts = asset.split('/');
        var spliceStart = 0;

        assetParts.splice(spliceStart, 0, 'static', moment(fileStats.mtime).unix());

        return assetParts.join('/');
      };

      var rewritableAssetExtensions = _.map(rewriteAssetsConfig.fileTypes, function(item) {
        return '.' + item;
      });

      var allAssets = recursiveWalk(rootDirectory + '/' + grunt.config.get('globalConfig').webRoot);
      var rewriteAssets = [];

      allAssets.forEach(function(item) {
        if(rewritableAssetExtensions.indexOf(path.extname(item)) !== -1) {
          rewriteAssets.push(item);
        }
      });

      var filesToProcess = [];

      //todo: can we make this part of the config
      if(rewriteType === 'default') {
        filesToProcess = recursiveWalk(rootDirectory + '/' + grunt.config.get('globalConfig').webRoot + '/' + grunt.config.get('globalConfig').appRoot + '/' + grunt.config.get('build').buildPath);

        filesToProcess.push(rootDirectory + '/' + grunt.config.get('globalConfig').webRoot + '/index.html');
      } else if(rewriteType === 'ui-testing') {
        filesToProcess =[rootDirectory + '/' + grunt.config.get('globalConfig').webRoot + '/index-ut.html'];
      } else {
        console.log(("No proper rewrite type given, use 'default' or 'ui-testing'").red);
      }

      var currentDomainKey = 0;
      var maxDomainKey;

      if(_.isString(rewriteAssetsConfig.domains)) {
        rewriteAssetsConfig.domains = [rewriteAssetsConfig.domains];
      } else if(!_.isArray(rewriteAssetsConfig.domains)) {
        rewriteAssetsConfig.domains = [];
      }

      maxDomainKey = rewriteAssetsConfig.domains.length - 1;

      filesToProcess.forEach(function(file) {
        var fileContents = fs.readFileSync(file, 'ascii');

        rewriteAssets.forEach(function(asset) {
          var fullPath = asset;
          asset = asset.replace(rootDirectory + '/' + grunt.config.get('globalConfig').webRoot + '/', '');

          var regex = new RegExp('((http[s]?:)?//[a-zA-Z0-9-_.]*.[a-zA-Z0-9-_]*.[a-zA-Z0-9-_]{2,6})?/?((static/[0-9]*/)+)?' + asset, 'g');
          var rewrittenPath = getRewriteAssetsPath(asset, fullPath);

          //see if we should set the full url or just leave it as a relative path
          if(rewriteAssetsConfig.domains.length > 0) {
            rewrittenPath = rewriteAssetsConfig.domains[currentDomainKey] + '/' + rewrittenPath;

            if(maxDomainKey > 0 && currentDomainKey >= maxDomainKey) {
              currentDomainKey = 0;
            } else if(maxDomainKey > 0 && _.isArray(fileContents.match(regex))) {
              currentDomainKey += 1;
            }
          } else if(rewriteAssetsConfig.prependSlash !== false) {
            rewrittenPath = '/' + rewrittenPath;
          }

          fileContents = fileContents.replace(regex, rewrittenPath);
        });

        console.log(('rewriting assets in ' + file).green);
        fs.writeFileSync(file, fileContents, 'ascii');
      });
    }
  }
};
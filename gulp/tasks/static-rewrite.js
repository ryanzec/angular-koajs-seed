var gulp = require('gulp');
var gulpConfig = require('../config.js');
var buildMetaDataFactory = require('build-meta-data');
var globArray = require('glob-array');
var _ = require('lodash');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var crypto = require('crypto');

var config = require('../config.js').tasks.staticRewrite;
var currentDomainKey = 0;

gulp.task('static-rewrite', 'Rewrite assets with "/static/[timestamp]/..." to help with browsers caching resources', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/static-rewrite.json');

  function getRewriteAssetsPath(asset, fullPath) {
    var shasum = crypto.createHash('sha1');
    shasum.update(fs.readFileSync(fullPath, {
      encoding: 'utf8'
    }));
    var sha = shasum.digest('hex');
    var assetParts = asset.split('/');
    var spliceStart = 0;

    assetParts.splice(spliceStart, 0, 'static', sha);

    return assetParts.join('/');
  };

  var rewritableAssetExtensions = _.map(config.fileTypesToRewrite, function(item) {
    return '.' + item;
  });
  var processAssetExtensions = _.map(config.fileTypesToProcess, function(item) {
    return '.' + item;
  });

  var allAssets = globArray.sync(config.assetPatterns);
  var rewriteAssets = [];

  allAssets.forEach(function(item) {
    if(fs.statSync(process.cwd() + '/' + item).isDirectory() === false && rewritableAssetExtensions.indexOf(path.extname(item)) !== -1) {
      rewriteAssets.push(item.replace(process.cwd() + '/', ''));
    }
  });

  var filesToProcess = [];
  var searchFor = [
    gulpConfig.buildPath + '/**/*.*'
  ];

  filesToProcess = globArray.sync(searchFor);

  filesToProcess = filesToProcess.filter(function(filePath) {
    return processAssetExtensions.indexOf(path.extname(filePath)) !== -1;
  });

  var count = filesToProcess.length;

  //only filter rewrite assets if the files we are rewriting the assets in have not changes
  if(!buildMetaData.hasChangedFile(filesToProcess)) {
    rewriteAssets = buildMetaData.getChangedFiles(rewriteAssets);
  }

  if(count > 0 && rewriteAssets.length > 0) {
    gulp.src(filesToProcess, {
      base: gulpConfig.buildPath
    })
    .pipe(through.obj(function(file, encoding, cb) {
      if(!file.contents instanceof Buffer) {
        return cb(new Error('static rewrite can only work on buffers'), file);
      } else {
        var fileContents = String(file.contents);
        var regex = new RegExp("[\"']((http[s]?:)?//[a-zA-Z0-9-_.]*\\.[a-zA-Z0-9-_]*\\.[a-zA-Z0-9-_]{2,6})?/?(((static/[0-9a-zA-Z]*/)+)?((" + config.assetPaths.join('|') + ")/[a-zA-Z0-9-_./]+\\.(" + config.fileTypesToRewrite.join('|') + ")))[\"']", 'g');

        var noMatches = false;
        var match;
        var assetMatches = [];

        do {
          match = regex.exec(fileContents);

          if(match === null) {
            noMatches = true;
          } else {
            var matchObject = {};
            matchObject[match[0]] = match[6];
            assetMatches.push(matchObject);
          }
        } while(noMatches === false);

        if(assetMatches.length > 0) {
          gutil.log(gutil.colors.magenta('rewriting assets in ' + gulpConfig.buildPath + '/' + file.relative + ':'));
          assetMatches.forEach(function(matchObject) {
            var toReplace = Object.keys(matchObject)[0];
            var assetPath = matchObject[Object.keys(matchObject)[0]];
            var rewrittenPath = getRewriteAssetsPath(assetPath, process.cwd() + '/' + gulpConfig.webPath + '/' + assetPath);

            if(config.domains.length > 0) {
              rewrittenPath = config.domains[currentDomainKey] + '/' + rewrittenPath;

              if(currentDomainKey >= config.domains.length - 1) {
                currentDomainKey = 0;
              } else {
                currentDomainKey += 1;
              }
            } else if(config.prependSlash === true) {
              rewrittenPath = '/' + rewrittenPath;
            }

            rewrittenPath = '"' + rewrittenPath + '"';

            gutil.log(gutil.colors.cyan(toReplace + ' => ' + rewrittenPath));

            fileContents = fileContents.replace(toReplace, rewrittenPath);
          });
        } else {
          gutil.log(gutil.colors.green('no assets to rewrite in ' + gulpConfig.buildPath + '/' + file.relative));
        }

        file.contents = new Buffer(fileContents);
      }

      return cb(null, file);
    }))
    .pipe(through.obj(function(file, encoding, cb) {
      count -= 1;

      if(count == 0) {
        //add a delay here to make sure the build meta data incorperates the static rewrite when hashing the files
        setTimeout(function() {
          buildMetaData.addBuildMetaDataFiles(rewriteAssets);
          buildMetaData.addBuildMetaDataFiles(filesToProcess);

          if(buildMetaData.writeFile()) {
            gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
          }
        }, 500);

        done();
      }

      cb(null, file);
    }))
    .pipe(gulp.dest(gulpConfig.buildPath));
  } else {
    done();
  }
});

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
var replace = require('gulp-replace');

var config = {
  fileTypesToRewrite: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css', 'map', 'html'],
  fileTypesToProcess: ['html', 'css', 'js'],
  prependSlash: true,
  domains: [],
  assetPatterns: [
    gulpConfig.webPath + '/*.html',
    gulpConfig.webPath + '/!(build)/**/*.*',
    gulpConfig.webPath + '/build/*.*',
    gulpConfig.vendorComponentsPath + '/**/*.*'
  ]
};

gulp.task('static-rewrite', 'Rewrite assets with "/static/[timestamp]/..." to help with browsers caching resources', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/static-rewrite.json');

  function getRewriteAssetsPath(asset, fullPath) {
    var fileStats = fs.statSync(fullPath);
    var assetParts = asset.split('/');
    var spliceStart = 0;

    assetParts.splice(spliceStart, 0, 'static', moment(fileStats.mtime).unix());

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
    if(rewritableAssetExtensions.indexOf(path.extname(item)) !== -1) {
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
    var test = gulp.src(filesToProcess, {
      base: gulpConfig.buildPath
    });

    rewriteAssets.forEach(function(asset) {
      var fullPath = process.cwd() + '/' + asset;
      asset = asset.replace(gulpConfig.webPath + '/', '');
      var regex = new RegExp('((http[s]?:)?//[a-zA-Z0-9-_.]*.[a-zA-Z0-9-_]*.[a-zA-Z0-9-_]{2,6})?/?((static/[0-9]*/)+)?' + asset, 'g');
      var rewrittenPath = getRewriteAssetsPath(asset, fullPath);//see if we should set the full url or just leave it as a relative path

      if(config.domains.length > 0) {
        rewrittenPath = config.domains[currentDomainKey] + '/' + rewrittenPath;

        if(maxDomainKey > 0 && currentDomainKey >= maxDomainKey) {
          currentDomainKey = 0;
        } else if(maxDomainKey > 0 && _.isArray(fileContents.match(regex))) {
          currentDomainKey += 1;
        }
      } else if(config.prependSlash === true) {
        rewrittenPath = '/' + rewrittenPath;
      }

      test.pipe(replace(regex, rewrittenPath));
    });

    gutil.log(gutil.colors.cyan('rewriting ' + rewriteAssets.length + ' assets in ' + filesToProcess.length + ' files'));

    test.pipe(gulp.dest(gulpConfig.buildPath));
    test.pipe(through.obj(function(file, encoding, cb) {
      count -= 1;

      if(count == 0) {
        buildMetaData.addBuildMetaDataFiles(rewriteAssets);
        buildMetaData.addBuildMetaDataFiles(filesToProcess);

        if(buildMetaData.writeFile()) {
          gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
        }

        done();
      }

      cb();
    }));
  } else {
    done();
  }
});

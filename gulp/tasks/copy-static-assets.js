var gulp = require('gulp');
var gulpConfig = require('../config.js');
var buildMetaDataFactory = require('build-meta-data');
var gutil = require('gulp-util');
var config = {
  staticAssetExtensions: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg'],
  staticAssetFolders: [
    gulpConfig.vendorComponentsPath,
    gulpConfig.appPath + '/components'
  ]
}

gulp.task('copy-static-assets', 'Copy static assets to the build folder', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/static-assets.json');
  var assets = [];

  config.staticAssetFolders.forEach(function(folder) {
    config.staticAssetExtensions.forEach(function(extension) {
      assets.push(folder + '/**/*.' + extension);
    });
  });

  var changedFiles = buildMetaData.getChangedFiles(assets);

  if(changedFiles.length > 0) {
    var stream = gulp.src(assets, {
      base: gulpConfig.webPath
    })
    .pipe(gulp.dest(gulpConfig.buildPath));

    stream.on('end', function() {
      buildMetaData.addBuildMetaDataFiles(changedFiles);

      if(buildMetaData.writeFile()) {
        gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
      }

      done();
    });

    stream.on('error', function(err) {
      done(err);
    });
  } else {
    done();
  }
});

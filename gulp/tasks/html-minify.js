var gulp = require('gulp');
var gulpConfig = require('../config.js');
var buildMetaDataFactory = require('build-meta-data');
var minifyHtml = require('gulp-minify-html');
var gutil = require('gulp-util');

gulp.task('html-minify', 'Minify the HTML', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/html.json');
  var files = [
    gulpConfig.webPath + '/*.html',
    gulpConfig.vendorComponentsPath + '/**/*.html',
    gulpConfig.appPath + '/components/**/*.html'
  ];

  var changedFiles = buildMetaData.getChangedFiles(files);

  if(changedFiles.length > 0) {
    var stream = gulp.src(changedFiles, {
      base: gulpConfig.webPath
    })
    .pipe(minifyHtml({
      empty: true,
      quotes: true,
      conditionals: true,
      comments: true
    }))
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

var gulp = require('gulp');
var gulpConfig = require('../config.js');
var buildMetaDataFactory = require('build-meta-data');
var gutil = require('gulp-util');
var jade = require('gulp-jade');

gulp.task('jade', 'Compile Jade template into HTML', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/jade.json');
  var changedFiles = buildMetaData.getChangedFiles(gulpConfig.sourceFiles.jade);

  if(changedFiles.length > 0) {
    var stream = gulp.src(changedFiles, {
      base: gulpConfig.webPath
    })
    .pipe(jade({
      //this allows jade to create attribute with no values which is required for it to work with AngularJS properly
      doctype: "html"
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
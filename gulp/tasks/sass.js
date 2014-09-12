var gulp = require('gulp');
var buildMetaDataFactory = require('build-meta-data');
var gulpConfig = require('../config.js');
var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');
var shell = require('gulp-shell');
var _ = require('lodash');

gulp.task('sass', 'Compile SASS into CSS', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/sass.json');
  var sassFiles = buildMetaData.getChangedFiles(gulpConfig.sourceFiles.sass);

  if(sassFiles.length > 0) {
    var files = gulpConfig.compileFiles.sass;
    var count = Object.keys(files).length;

    _.forEach(files, function(destination, source) {
      var command = 'sass --scss -q -t compressed --scss ' + source + ' ' + destination;
      gutil.log(gutil.colors.cyan('running command:'), command);

      // we are calling ruby sass manually because gulp-ruby-sass currently does not work with imports and older versions are too slow
      gulp.src('', {read: false})
      .pipe(shell([
        command
      ]))
      .pipe(through.obj(function(file, excoding, cb) {
        count -= 1;

        if(count == 0) {
          buildMetaData.addBuildMetaDataFiles(sassFiles);

          if(buildMetaData.writeFile()) {
            gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
          }

          done();
        }

        cb();
      }));
    });
  } else {
    done();
  }
});

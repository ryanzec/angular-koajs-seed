var gulp = require('gulp');
var jshint = require('gulp-jshint');
var gulpConfig = require('../config.js');

gulp.task('jshint', 'Run JSHint against the JavaScript code', function() {
  return gulp.src([
      gulpConfig.appPath + '/application.js',
      gulpConfig.appPath + '/components/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

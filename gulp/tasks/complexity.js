var gulp = require('gulp');
var complexity = require('gulp-complexity');
var gulpConfig = require('../config.js');

gulp.task('complexity', 'Display the complexity of the JavaScript code', function() {
  return gulp.src(gulpConfig.sourceFiles.javascript)
  .pipe(complexity({
    cyclomatic: 10,
    halstead: 20,
    maintainability: 80
  }));
});

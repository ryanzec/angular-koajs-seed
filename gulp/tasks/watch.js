var gulp = require('gulp');
var gulpConfig = require('../config.js');

gulp.task('watch', 'Watch files and perform a build-quick when a file changes', function() {
  gulp.watch([
    gulpConfig.appPath + '/*.*',
    gulpConfig.appPath + '/components/**/*.*',
    gulpConfig.webPath + '/**/*.scss',
    gulpConfig.webPath + '/*.html',
    gulpConfig.vendorComponentsPath + '/**/*.*'
  ], [
    'build-quick'
  ]);
});

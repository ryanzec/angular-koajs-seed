var gulp = require('gulp');
var gulpConfig = require('../config.js');

gulp.task('default', 'Watch files and perform a build-quick when a file changes', function() {
  gulp.watch([
    gulpConfig.appPath + '/*.*',
    gulpConfig.appPath + '/components/**/*.*',
    gulpConfig.appPath + '/**/*.scss',
    gulpConfig.webPath + '/*.html',
    gulpConfig.vendorComponentsPath + '/**/*.*'
  ], [
    'build-quick'
  ]);
});

var gulp = require('gulp');
var gutil = require('gulp-util');
var async = require('async');
var del = require('del');
var spawn = require('child_process').spawn;
var gulpConfig = require('../config.js');
var fs = require('fs');

gulp.task('bower', 'Download and move bower packages', function(done) {
  var bowerInstallDirectory = JSON.parse(fs.readFileSync(process.cwd() + '/.bowerrc', {
    encoding: 'utf8'
  })).directory;

  function bowerInstall(cb) {
    var command = 'bower install';
    gutil.log(gutil.colors.cyan('running command:'), command);
    var childProcess = spawn('bower', ['install'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    }).on('close', cb);
  }

  function bowerCopy(cb) {
    gulp.src(gulpConfig.bowerCopy.map(function(item) {
      return './' + bowerInstallDirectory + '/' + item;
    }), {base: './' + bowerInstallDirectory})
    .pipe(gulp.dest('./' + gulpConfig.vendorComponentsPath))
    .on('end', cb);
  }

  function bowerCopyClean(cb) {
    del('./' + bowerInstallDirectory, cb);
  }

  function bowerClean(cb) {
    del('./' + gulpConfig.vendorComponentsPath, cb);
  }

  async.series([
    bowerCopyClean,
    bowerInstall,
    bowerClean,
    bowerCopy,
    bowerCopyClean
  ], done);
});

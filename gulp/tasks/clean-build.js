var gulp = require('gulp');
var async = require('async');
var del = require('del');
var gulpConfig = require('../config.js');
var runSequence = require('run-sequence');

gulp.task('clean-build', 'Remove all build data and code in order to perform a build from scratch', function(done) {
  function removeBuildMetaData(cb) {
    del('./gulp/build-meta-data', cb);
  }

  function removeBuildCode(cb) {
    del('./' + gulpConfig.buildPath, cb);
  }

  function removeSassCache(cb) {
    del('./.sass-cache', cb);
  }

  async.series([
    removeBuildMetaData,
    removeBuildCode,
    removeSassCache
  ], done);
});

gulp.task('build-clean', "Perform a clean build", function(done) {
  runSequence(
    'clean-build',
    'build',
    done
  );
});

gulp.task('build-clean-quick', "Perform a clean build", function(done) {
  runSequence(
    'clean-build',
    'build-quick',
    done
  );
});

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', 'Builds the code along with running quality checks (tests, hints, etc...)', function(done) {
  runSequence(
    'jshint',
    ['sass', 'javascript', 'html-minify', 'copy-static-assets'],
    'static-rewrite',
    'karma',
    'complexity',
    done
  );
});

gulp.task('build-quick', 'Builds the code without running quality checks', function(done) {
  runSequence(
    ['sass', 'javascript', 'html-minify', 'copy-static-assets'],
    'static-rewrite',
    done
  );
});

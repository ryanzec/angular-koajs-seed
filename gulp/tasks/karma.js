var gulp = require('gulp');
var karma = require('karma').server;
var gulpConfig = require('../config.js');
var _ = require('lodash');

gulp.task('karma', 'Run the Karma tests', function(done) {
  var karmaConfig = require('../../karma/unit-tests.phantom.config.json');
  karmaConfig.basePath = './' + gulpConfig.webPath;
  karma.start(_.assign({}, karmaConfig, {singleRun: true}), done);
});

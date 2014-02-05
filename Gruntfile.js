var fs = require('fs');
var glob = require('glob');
var exec = require('child_process').exec;
var sys = require('sys');
var colors = require('colors');
var uglifyjs = require('uglify-js');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');
var crypto = require('crypto');
var _ = require('lodash');
var timer = require("grunt-timer");
var moment = require('moment');
var lingo = require('lingo');

module.exports = function(grunt) {
  timer.init(grunt);
  var globalConfig = require('./grunt/global-config');

  grunt.initConfig({
    globalConfig: globalConfig,
    build: require('./grunt/configurations/build'),
    watch: require('./grunt/configurations/watch'),
    sass: require('./grunt/configurations/sass'),
    karma: require('./grunt/configurations/karma'),
    complexity: require('./grunt/configurations/complexity'),
    jshint: require('./grunt/configurations/jshint'),
    ngtemplates: require('./grunt/configurations/ngtemplates'),
    bowercopy: require('./grunt/configurations/bowercopy'),
    shell: require('./grunt/configurations/shell')
  });

  //load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('bower', [
    'shell:bower',
    'bowercopy'
  ]);

  grunt.registerTask('build-development', [
    'sass',
    'ngtemplates:app',
    'combine-assets:default',
    'rewrite-assets:default'
  ]);

  grunt.registerTask('build-ui-testing', [
    'sass',
    'ngtemplates:app',
    'combine-assets:ui-testing',
    'rewrite-assets:ui-testing'
  ]);

  grunt.registerTask('build-production', [
    'jshint',
    'sass',
    'karma',
    'ngtemplates:app',
    'combine-assets:default',
    'rewrite-assets:default',
    'complexity:reference'
  ]);

  grunt.registerTask('combine-assets', 'Combines assets files (just works with javascript files right now)', require('./grunt/tasks/combine-assets')(grunt));
  grunt.registerTask('rewrite-assets', 'Rewrites urls for assets to prevent caching issues', require('./grunt/tasks/rewrite-assets')(grunt));
};

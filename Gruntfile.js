var timer = require("grunt-timer");

module.exports = function(grunt) {
  timer.init(grunt);
  var globalConfig = require('./grunt/global-config');
  var buildTools = require('./grunt/tasks/build-tools')(grunt);

  grunt.initConfig({
    globalConfig: globalConfig,
    combineAssets: require('./grunt/configurations/combine-assets'),
    rewriteAssets: require('./grunt/configurations/rewrite-assets')(grunt),
    watch: require('./grunt/configurations/watch'),
    sass: require('./grunt/configurations/sass'),
    karma: require('./grunt/configurations/karma'),
    complexity: require('./grunt/configurations/complexity'),
    jshint: require('./grunt/configurations/jshint'),
    ngtemplates: require('./grunt/configurations/ngtemplates'),
    bowercopy: require('./grunt/configurations/bowercopy'),
    shell: require('./grunt/configurations/shell'),
    htmlMinifier: require('./grunt/configurations/html-minifier')
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

  //load custom tasks
  grunt.registerTask('combine-assets', 'Combines assets files (just works with javascript files right now)', buildTools.combineAssets);
  grunt.registerTask('rewrite-assets', 'Rewrites urls for assets to prevent caching issues', buildTools.rewriteAssets);
  grunt.registerTask('html-minifier', 'Minifies HTML files', buildTools.htmlMinifier);

  //setup shortcut tasks
  grunt.registerTask('bower', [
    'shell:bower',
    'bowercopy'
  ]);
  grunt.registerTask('build-development', [
    'sass',
    //add this in if you wish to serve pre-compiled template files
    //'ngtemplates:app',
    'html-minifier:default',
    'combine-assets:default',
    'rewrite-assets:default'
  ]);
  grunt.registerTask('build-production', [
    'jshint',
    'sass',
    //add this in if you wish to serve pre-compiled template files
    //'ngtemplates:app',
    'html-minifier:default',
    'combine-assets:default',
    'rewrite-assets:default',
    'karma',
    'complexity:reference'
  ]);
};

module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: '..',
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    singleRun: true,
    files: [
      'web/components/moment/moment.js',
      'web/components/jquery/jquery.js',
      'web/components/angular/angular.js',
      'web/components/angular-mocks/angular-mocks.js',
      'web/components/angular-ui-router/release/angular-ui-router.js',
      'web/app/*.js',
      'web/app/components/**/*.js',
      'tests/*.js'
    ]
  });
};
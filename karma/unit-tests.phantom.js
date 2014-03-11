module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: '../web',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['PhantomJS'],
    singleRun: true,
    files: [
      'components/lodash/dist/lodash.min.js',
      'app/build/libraries.js',
      'components/angular-mocks/angular-mocks.js',
      'app/build/application.js',
      'app/**/*.spec.js'
    ]
  });
};
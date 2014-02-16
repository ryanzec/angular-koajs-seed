var scripts = require('./lib/client-scripts.js');
var variables = require('./lib/variables.js');

module.exports = {
  name: 'home page',

  'should display angular variable': function(test) {
    test.open(variables.baseUrl + '/home')
    .waitFor(scripts.angular)
      .assert.text('.home-page', 'Hello AngularJS Seed', 'angular variable displayed')
    .done();
  }
};
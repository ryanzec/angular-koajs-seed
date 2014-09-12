var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

//since we are using mocha/chai, we need to change the glocal expect to chai's expect
expect = chai.expect;

exports.config = {
  framework: 'mocha',
  specs: ['./tests/**/*.spec.js'],
  params: {},
  chromeOnly: true,
  onPrepare: function() {
    var width = 1024;
    var height = 768;
    browser.driver.manage().window().setSize(width, height);
  },
  mochaOpts: {
    slow: 5000,
    reporter: 'spec'
  }
};

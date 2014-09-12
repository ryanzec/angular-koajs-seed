var protractorTestObjects = require('protractor-test-objects');
var homePage = protractorTestObjects.basePage.create();

homePage.baseSelector = '.home-page';

homePage.isDisplayed = function() {
  expect($(this.getSelector()).getText()).to.eventually.equal('Hello AngularJS Seed');
};

module.exports = {
  create: function(baseUrl, appendUrl) {
    baseUrl = baseUrl || '/home';
    var newPage = Object.create(homePage);
    newPage.baseUrl = baseUrl;
    newPage.open(appendUrl);
    return newPage;
  }
};

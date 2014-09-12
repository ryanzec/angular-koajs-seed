describe('home page', function() {
  before(function() {
    this.homePage = require('../lib/page/home');
  });

  it('should dipslay home page', function() {
    var page = this.homePage.create();

    page.isDisplayed();
  });
});

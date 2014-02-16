module.exports = {
  angular: function() {
    var el = document.querySelector('html');
    var done = false;

    var callback = function(e) {
      done = true;
    };

    try {
      angular.element(el).injector().get('$browser').notifyWhenNoOutstandingRequests(callback);
    } catch (e) {
      callback(e);
    }

    return done;
  }
}
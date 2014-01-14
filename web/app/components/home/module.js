angular.module('app.home.routing', [
  'app.core'
])
.config([
  '$stateProvider',
  function($stateProvider) {
    $stateProvider
    .state('app.home', {
      url: '/home',
      abstract: true,
      views: {
        '': {
          templateUrl: 'app/components/core/assets/templates/module-wrapper.html'
        }
      }
    });
  }
]);

angular.module('app.home', [
  'app.home.routing',
  'app.home.home'
]);
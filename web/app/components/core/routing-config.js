angular.module('app.core.routing')
.config([
  '$stateProvider',
  function($stateProvider) {
    $stateProvider
    .state('app', {
      name: 'app',
      url: '',
      views: {
        '': {
          templateUrl: 'app/components/core/assets/templates/module-wrapper.html'
        },
        'header': {
          templateUrl: 'app/components/core/assets/templates/header.html'
        },
        'footer': {
          templateUrl: 'app/components/core/assets/templates/footer.html'
        }
      }
    });
  }
]);
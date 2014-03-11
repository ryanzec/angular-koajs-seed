angular.module('app.core', [
  'ui.router'
])
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
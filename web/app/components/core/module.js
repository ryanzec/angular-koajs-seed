angular.module('app.core.routing', [
  'app.core'
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
          template: '<div ui-view></div>'//'/app/components/core/assets/templates/module-wrapper.html'
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

angular.module('app.core', [
  'ui.router',
  'app.core.routing',
  'app.core.constants',
  'app.core.templateInterceptor'
]);
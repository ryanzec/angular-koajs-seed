angular.module('app.home')
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
    })
    .state('app.home.home', {
      url: '',
      views: {
        '': {
          templateUrl: 'app/components/home/assets/templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    });
  }
])
.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.name = 'AngularJS Seed';
}]);

angular.module('app.home.controllers', [
  'app.core'
])
.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.name = 'AngularJS Seed';
}]);
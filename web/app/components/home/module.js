angular.module('app.home.routing', [
  'ui.router'
]);

angular.module('app.home.controllers', [
  'app.core'
]);

angular.module('app.home', [
  'app.home.routing',
  'app.home.controllers'
]);
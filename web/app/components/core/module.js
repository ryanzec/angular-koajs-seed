angular.module('app.core.config', []);

angular.module('app.core.routing', [
  'ui.router'
]);

angular.module('app.core', [
  'app.core.routing',
  'app.core.config'
]);
angular.module("app",["app.core","app.home"]).config(["$locationProvider","$urlRouterProvider",function(e,o){e.html5Mode(!0),o.otherwise("/home")}]).run(["$state","$rootScope",function(){}]),angular.module("app.core.config",[]),angular.module("app.core.routing",["ui.router"]),angular.module("app.core",["app.core.routing","app.core.config"]),angular.module("app.core.routing").config(["$stateProvider",function(e){e.state("app",{name:"app",url:"",views:{"":{templateUrl:"app/components/core/assets/templates/module-wrapper.html"},header:{templateUrl:"app/components/core/assets/templates/header.html"},footer:{templateUrl:"app/components/core/assets/templates/footer.html"}}})}]),angular.module("app.core.config").config(["$httpProvider",function(e){e.responseInterceptors.push(["$q","$templateCache",function(e,o){var t={},a=/data-dom-(remove|keep)/,r=/\.html$|\.html\?/i;return function(p){return p.then(function(e){var p=e.config.url,n=e.data;if(!t[p]&&r.test(p)&&a.test(n)){var l=$("<div>").append(n);l.find("[data-dom-keep],[data-dom-remove]").each(function(){var e,o=$(this),t=o.data();t.domRemove,t.domKeep,e===!0&&o.remove()}),e.data=l.html(),o.put(p,e.data),t[p]=!0}return e},function(o){return e.reject(o)})}}])}]),angular.module("app.home.routing",["ui.router"]),angular.module("app.home.controllers",["app.core"]),angular.module("app.home",["app.home.routing","app.home.controllers"]),angular.module("app.home.routing").config(["$stateProvider",function(e){e.state("app.home",{url:"/home","abstract":!0,views:{"":{templateUrl:"app/components/core/assets/templates/module-wrapper.html"}}}).state("app.home.home",{url:"",views:{"":{templateUrl:"app/components/home/assets/templates/home.html",controller:"HomeCtrl"}}})}]),angular.module("app.home.controllers",["app.core"]).controller("HomeCtrl",["$scope",function(e){e.name="AngularJS Seed"}]);
//# sourceMappingURL=/source/application.js.map
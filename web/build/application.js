angular.module("app",["app.core","app.home"]).config(["$locationProvider","$urlRouterProvider",function(a,b){a.html5Mode(!0),b.otherwise("/home")}]).run(["$state","$rootScope",function(){}]),angular.module("app.core",["ui.router"]).config(["$stateProvider",function(a){a.state("app",{name:"app",url:"",views:{"":{templateUrl:"/static/126025f907e1d2e047017f104d047975ed8208d6/app/components/core/assets/templates/module-wrapper.html"},header:{templateUrl:"/static/f886bf54cfd54ee48a416383f8e98cad03afa96d/app/components/core/assets/templates/header.html"},footer:{templateUrl:"/static/90150dbb06f1f44af3bea9df6a3175cda6128205/app/components/core/assets/templates/footer.html"}}})}]),angular.module("app.home",["app.core"]),angular.module("app.core").factory("templateModifierInterceptor",["$q","$templateCache",function(a,b){var c={},d=/data-dom-(remove|keep)/,e=/\.html$|\.html\?/i;return{response:function(a){var f=a.config.url,g=a.data;if(!c[f]&&e.test(f)&&d.test(g)){var h=$("<div>").append(g);h.find("[data-dom-keep],[data-dom-remove]").each(function(){{var a,b=$(this),c=b.data();c.domRemove,c.domKeep}a===!0&&b.remove()}),a.data=h.html(),b.put(f,a.data),c[f]=!0}return a},responseError:function(b){return a.reject(b)}}}]).config(["$httpProvider",function(a){a.interceptors.push("templateModifierInterceptor")}]),angular.module("app.home").config(["$stateProvider",function(a){a.state("app.home",{url:"/home","abstract":!0,views:{"":{templateUrl:"/static/126025f907e1d2e047017f104d047975ed8208d6/app/components/core/assets/templates/module-wrapper.html"}}}).state("app.home.home",{url:"",views:{"":{templateUrl:"/static/1ac983c7f7934d0192615fe8d9c86c8820b6e535/app/components/home/assets/templates/home.html",controller:"HomeCtrl"}}})}]).controller("HomeCtrl",["$scope",function(a){a.name="AngularJS Seed"}]);
//# sourceMappingURL=application.js.map
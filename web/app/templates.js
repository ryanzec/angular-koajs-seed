angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/components/core/assets/templates/footer.html',
    "<div class=footer>Footer</div>"
  );


  $templateCache.put('app/components/core/assets/templates/header.html',
    "<div class=header>Header</div>"
  );


  $templateCache.put('app/components/core/assets/templates/module-wrapper.html',
    "<div ui-view=\"\"></div>"
  );


  $templateCache.put('app/components/home/assets/templates/home.html',
    "<div class=home-page>Hello {{ name }}</div>"
  );

}]);

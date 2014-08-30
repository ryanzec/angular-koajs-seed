angular.module('app.core')
.factory('templateModifierInterceptor', [
  '$q',
  '$templateCache',
  function($q, $templateCache) {
    var modifiedTemplates = {};
    var HAS_FLAGS_REGEX = /data-dom-(remove|keep)/;
    var HTML_PAGE_REGEX = /\.html$|\.html\?/i;

    return {
      response: function(response) {
        var url = response.config.url,
        responseData = response.data;

        if(!modifiedTemplates[url] && HTML_PAGE_REGEX.test(url) && HAS_FLAGS_REGEX.test(responseData)) {
          var template = $('<div>').append(responseData);

          // Find and parse the keep/omit attributes in the view.
          template.find('[data-dom-keep],[data-dom-remove]').each(function() {
            var removeElement;
            var element = $(this);
            var data = element.data();
            var removeFlags = data.domRemove;
            var keepFlags = data.domKeep;

            //todo: implement your own logic for removing elements from the template
            //example implementation where the data attribute stores user permissions
            /*var flags;
             if(removeFlags !== undefined) {
             removeElement = false;
             flags = removeFlags.split(',');
             } else {
             removeElement = true;
             flags = removeFlags.split(',');
             }

             if(session.user.hasPermissions(flags)) {
             removeElement = !removeElement;
             }*/

            if(removeElement === true) {
              element.remove();
            }
          });

          //update template cache
          response.data = template.html();
          $templateCache.put(url, response.data);
          modifiedTemplates[url] = true;
        }

        return response;
      },
      responseError: function(response) {
        return $q.reject(response);
      }
    };
  }
])
.config([
  '$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push('templateModifierInterceptor');
  }
]);
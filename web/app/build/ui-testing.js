angular.module("httpMocker",[]).factory("httpMocker",[function(){var e={};return{register:function(t,n,r,o){o=o||{},e[t+"||"+n]={response:r||"",statusCode:o.statusCode||200,headers:o.headers||"",payload:o.payload||void 0}},resolve:function(t,n){return e[t+"||"+n]||!1}}}]).provider("$httpBackend",[function(){function e(e,t,a,s,c,u,i){function d(e,t){var n=c.createElement("script"),r=function(){c.body.removeChild(n),t&&t()};return n.type="text/javascript",n.src=e,msie?n.onreadystatechange=function(){/loaded|complete/.test(n.readyState)&&r()}:n.onload=n.onerror=r,c.body.appendChild(n),r}return function(c,l,p,f,h,v,y,g){function w(){m=-1,T&&T(),b&&b.abort()}function C(t,n,s,c){var i=(l.match(r)||["",u])[1];L&&a.cancel(L),T=b=null,n="file"==i?s?200:404:n,n=1223==n?204:n,t(n,s,c),e.$$completeOutstandingRequest(o)}var m;if(e.$$incOutstandingRequestCount(),l=l||e.url(),"jsonp"==n(c)){var M="_"+(s.counter++).toString(36);s[M]=function(e){s[M].data=e};var T=d(l.replace("JSON_CALLBACK","angular.callbacks."+M),function(){s[M].data?C(f,200,s[M].data):C(f,m||-2),delete s[M]})}else{var $=i.resolve(c,l);if($)p==$.payload&&C(f,$.statusCode,$.response,$.headers);else{var b=new t;b.open(c,l,!0),_.forEach(h,function(e,t){e&&b.setRequestHeader(t,e)}),b.onreadystatechange=function(){if(4==b.readyState){var e=b.getAllResponseHeaders(),t=["Cache-Control","Content-Language","Content-Type","Expires","Last-Modified","Pragma"];e||(e="",_.forEach(t,function(t){var n=b.getResponseHeader(t);n&&(e+=t+": "+n+"\n")})),C(f,m||b.status,b.responseType?b.response:b.responseText,e)}},y&&(b.withCredentials=!0),g&&(b.responseType=g),b.send(p||"")}}if(v>0)var L=a(w,v);else v&&v.then&&v.then(w)}}var t=window.XMLHttpRequest||function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(n){}throw Error("This browser does not support XMLHttpRequest.")},n=function(e){return _.isString(e)?e.toLowerCase():e},r=/^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,o=function(){};return{$get:["$browser","$window","$document","httpMocker","$timeout",function(n,r,o,a){return e(n,t,n.defer,r.angular.callbacks,o[0],r.location.protocol.replace(":",""),a)}]}}]);
//# sourceMappingURL=/source/ui-testing.js.map
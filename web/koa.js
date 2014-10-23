var send = require('koa-send');
var fs = require('fs');
var path = require('path');
var koa = require('koa');
var app = module.exports = koa();

//yield compatible function
function readFile(file) {
  return function(fn){
    fs.readFile(file, 'utf8', fn);
  }
}

function fileExists(file) {
  return function(fn){
    fs.exists(file, function(exists) {
      fn(null, exists);
    });
  }
}

app.use(function *() {
  var convertStaticPath = function(resourcePath) {
    return resourcePath.replace(new RegExp('(static/[0-9a-zA-Z]*/)', 'g'), '');
  };
  var isHtmlFileRequest = this.path.substr(-5) === '.html';
  var filePath = this.path.substr(1);
  var rootDirectory = this.path.split('/')[1];
  var buildPath = 'build';
  var validRootDirectories = [
    'app',
    'components',
    'static',
    'source',
    'build'
  ];
  var loadIndex = true;

  //TODO: need to figure out cache system for static resources
  if(isHtmlFileRequest) {
    //serve the build version of the html which is compressed
    yield send(this, convertStaticPath(buildPath + '/' + filePath), {
      root: __dirname
    });
    loadIndex = false;
  } else if(validRootDirectories.indexOf(rootDirectory) !== -1) {
    //rewrite file path for static based URIs
    if(filePath.substr(0, 6) === 'static') {
      filePath = filePath.split('/').splice(2).join('/')
    };

    if(yield fileExists(__dirname + '/' + convertStaticPath(filePath))) {
      yield send(this, convertStaticPath(filePath), {
        root: __dirname
      });
      loadIndex = false;
    }
  }

  if(loadIndex === true) {
    //determine the index file to load
    var indexFile = 'index.html';

    if(this.req.headers['user-agent'] === 'UI_TESTING_MODE' || this.request.query.uiTestingMode === 'true') {
      indexFile = 'index-ut.html';
    }

    //pull in the html and load add it to the response
    var indexHtml = yield readFile(buildPath + '/' + indexFile);
    this.body = indexHtml;
  }
});

if(!module.parent) {
  app.listen(3000);
}

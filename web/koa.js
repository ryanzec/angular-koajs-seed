var send = require('koa-send');
var fs = require('fs');
var path = require('path');
var koa = require('koa');
var app = module.exports = koa();

//yield compatible read file
function readFile(file) {
  return function(fn){
    fs.readFile(file, 'utf8', fn);
  }
}

app.use(function *() {
  var isHtmlFileRequest = this.path.substr(-5) === '.html';
  var filePath = this.path.substr(1);
  var rootDirectory = this.path.split('/')[1];
  var buildPath = 'app/build';
  var validRootDirectories = [
    'app',
    'components',
    'static',
    'source'
  ];

  //you can remove this first part of this if statement and use the ngtemplate grunt tasks if you perfer to compile all your template beforehand
  if(isHtmlFileRequest) {
    //serve the build version of the html which is compressed
    yield send(this, buildPath + '/' + filePath, {
      root: __dirname
    });
  } else if(validRootDirectories.indexOf(rootDirectory) !== -1) {
    //rewrite file path for static based URIs
    if(filePath.substr(0, 6) === 'static') {
      filePath = filePath.split('/').splice(2).join('/')
    }

    yield send(this, filePath, {
      root: __dirname
    });
  } else {
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

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
  var rootDirectory = this.path.split('/')[1];
  var validRootDirectories = [
    'app',
    'components',
    'static'
  ];

  if(validRootDirectories.indexOf(rootDirectory) !== -1) {
    //determine the asset to send
    var filePath = this.path.substr(1);

    //rewrite file path for static based URIs
    if(filePath.substr(0, 6) === 'static') {
      filePath = filePath.split('/').splice(2).join('/')
    }

    yield send(this, filePath, {
      root: __dirname
    });
  } else {
    //determine the index file to load
    var indexFile = 'index-dev.html';

    if(this.req.headers['user-agent'] === 'UI_TESTING_MODE' || this.request.query.uiTestingMode === 'true') {
      indexFile = 'index-ut.html';
    }

    //pull in the html and load add it to the response
    var indexHtml = yield readFile(indexFile);
    this.body = indexHtml;
  }
});

if(!module.parent) {
  app.listen(3000);
}
var gulp = require('gulp');
var glob = require('glob');
var fs = require('fs');
var gulpConfig = require('./gulp/config.js');

if(!fs.existsSync(process.cwd() + '/' + gulpConfig.buildPath)) {
  fs.mkdirSync(process.cwd() + '/' + gulpConfig.buildPath);
}

require('gulp-help')(gulp);

//load tasks
var tasks = glob.sync('./gulp/tasks/*.*');

tasks.forEach(function(taskFilePath) {
  require(taskFilePath);
});

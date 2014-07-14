var gulp = require('gulp');
var glob = require('glob');

require('gulp-help')(gulp);

//load tasks
var tasks = glob.sync('./gulp/tasks/*.*');

tasks.forEach(function(taskFilePath) {
  require(taskFilePath);
});

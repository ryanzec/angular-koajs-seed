var gulp = require('gulp');
var buildMetaDataFactory = require('build-meta-data');
var fs = require('fs');
var gulpConfig = require('../config.js');
var uglify = require('gulp-uglifyjs');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var globArray = require('glob-array');

gulp.task('javascript', 'Concat and minify JavaScript (with UglifyJS)', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/javascript.json');
  var count = Object.keys(gulpConfig.compileFiles.javascript).length * 2;

  _.forEach(gulpConfig.compileFiles.javascript, function(buildFiles, buildFileName) {
    buildFiles = globArray.sync(buildFiles).filter(function(elem, pos, myArray) {
      return myArray.indexOf(elem) == pos && fs.lstatSync(process.cwd() + '/' + elem).isFile();
    });
    var fullBuildFilePath = process.cwd() + '/' + gulpConfig.buildPath + '/' + buildFileName;
    var relativeBuildFilePath = gulpConfig.buildPath + '/' + buildFileName;

    if(
      !fs.existsSync(fullBuildFilePath)
      || buildMetaData.hasChangedFile(buildFiles)
      || !buildMetaData.hasSameFiles(relativeBuildFilePath, buildFiles)
    ) {
      gulp.src(buildFiles)
      .pipe(uglify(buildFileName, {
        basePath: gulpConfig.webPath,
        outSourceMap: true
      }))
      .pipe(gulp.dest(gulpConfig.buildPath))
      .pipe(through.obj(function(file, encoding, cb) {
        count -= 1;

        //don't process the map file
        if(file.relative !== buildFileName) {
          buildMetaData.addBuildMetaDataFiles(buildFiles, relativeBuildFilePath);
        }

        if(count == 0) {
          if(buildMetaData.writeFile()) {
            gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
          }

          done();
        }

        cb(null, file);
      }));
    } else {
      count -= 2;
    }
  });

  if(count === 0) {
    done();
  }
});

var gulp = require('gulp');
var buildMetaDataFactory = require('build-meta-data');
var fs = require('fs');
var gulpConfig = require('../config.js');
var uglify = require('gulp-uglifyjs');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

gulp.task('javascript', 'Concat and minify JavaScript (with UglifyJS)', function(done) {
  var buildMetaData = buildMetaDataFactory.create(process.cwd() + '/gulp/build-meta-data/javascript.json');
  var count = 0;

  _.forEach(gulpConfig.compileFiles.javascript, function(buildFiles, buildFileName) {
    var fullBuildFilePath = process.cwd() + '/' + gulpConfig.buildPath + '/' + buildFileName;
    var relativeBuildFilePath = gulpConfig.buildPath + '/' + buildFileName;

    if(
      !fs.existsSync(fullBuildFilePath)
      || buildMetaData.hasChangedFile(buildFiles)
      || !buildMetaData.hasSameFiles(relativeBuildFilePath, buildFiles)
    ) {
      count += 1;
      gulp.src(buildFiles)
      .pipe(uglify(buildFileName, {
        basePath: gulpConfig.webPath,
        outSourceMap: true
      }))
      .pipe(gulp.dest(gulpConfig.buildPath))
      .pipe(through.obj(function(file, encoding, cb) {
        //don't process the map file
        if(file.relative !== buildFileName) {
          return;
        }

        count -= 1;
        buildMetaData.addBuildMetaDataFiles(buildFiles, relativeBuildFilePath);

        if(count == 0) {
          if(buildMetaData.writeFile()) {
            gutil.log(gutil.colors.cyan('writing build meta data file: ' + buildMetaData.filePath));
          }

          done();
        }

        cb();
      }));
    }
  });

  if(count === 0) {
    done();
  }
});

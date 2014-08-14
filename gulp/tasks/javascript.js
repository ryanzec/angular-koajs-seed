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
    var noSourceMapFileName = buildFileName.split('.')[0] + '.production' + '.js';
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
      gutil.log(gutil.colors.cyan('compiling the following files:'));
      buildFiles.forEach(function(buildFile) {
        gutil.log(gutil.colors.green(buildFile));
      });
      gutil.log(gutil.colors.cyan('to:'));
      gutil.log(gutil.colors.green(buildFileName));
      gutil.log(gutil.colors.green(noSourceMapFileName + ' (non-sourcemap version)'));
      gulp.src(buildFiles)
      .pipe(uglify(buildFileName, {
        basePath: gulpConfig.webPath,
        outSourceMap: true,

        //this option make it so that when attempting to find sources, it will add a '/' to the beginning which will make it uses the correct path
        output: {
          source_map: {
            file: buildFileName + '.map',
            root: '/'
          }
        }
      }))
      .pipe(through.obj(function(file, encoding, cb) {
        //create non-source map version of the file that can be used in production if you don't serve you development source code
        if(file.relative === buildFileName) {
          var fileContents = String(file.contents);
          fileContents = fileContents.replace(/\/\/# sourceMappingURL=.*.map$/g, '');
          fs.writeFileSync(gulpConfig.buildPath + '/' + noSourceMapFileName, fileContents, {
            encoding: 'utf8'
          });
        }

        cb(null, file);
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

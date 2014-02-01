var fs = require('fs');
var glob = require('glob');
var exec = require('child_process').exec;
var sys = require('sys');
var colors = require('colors');
var uglifyjs = require('uglify-js');
var cleanCss = require('clean-css');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');
var crypto = require('crypto');
var xRegExp = require('xregexp').XRegExp;
var _ = require('lodash');
var timer = require("grunt-timer");
var moment = require('moment');
var lingo = require('lingo');

var buildMetaData = (function() {
  //we need to keep tracking of some meta data about the build files to be able to deteremine if we need to generate them
  var buildMetaDataFilePath = __dirname + '/build-meta-data.json';
  var currentBuildMetaData = {};
  var lastBuildMetaData = {};
  var lastBuildFileKeys = [];

  var changedFilesKeys = [];

  return {
    initialize: function(metaDataFilePath){
      buildMetaDataFilePath = metaDataFilePath;

      if(fs.existsSync(buildMetaDataFilePath)) {
        lastBuildMetaData = JSON.parse(fs.readFileSync(buildMetaDataFilePath, 'ascii'))
      }

      if(!lastBuildMetaData['workingFiles']) {
        lastBuildMetaData['workingFiles'] = {};
      }

      if(!currentBuildMetaData['workingFiles']) {
        currentBuildMetaData['workingFiles'] = lastBuildMetaData['workingFiles'];
      }

      if(!lastBuildMetaData['buildFiles']) {
        lastBuildMetaData['buildFiles'] = {};
      } else {
        lastBuildFileKeys = Object.keys(lastBuildMetaData['buildFiles']);
      }

      if(!currentBuildMetaData['buildFiles']) {
        currentBuildMetaData['buildFiles'] = lastBuildMetaData['buildFiles'];
      }

      //todo: look at using this instead of above
      //currentBuildMetaData = _.merge(lastBuildMetaData, currentBuildMetaData);

      //lets cache all the files that have changed upfront
      for(var resourcePath in lastBuildMetaData['workingFiles']) {
        if(
        lastBuildMetaData['workingFiles'][resourcePath]
        && this.getFileHash(resourcePath) !== lastBuildMetaData['workingFiles'][resourcePath].fileHash
        ) {
          changedFilesKeys.push(resourcePath);
        }
      }
    },

    invalidateBuildFile: function(file) {
      delete currentBuildMetaData['buildFiles'][file];
    },

    /**
     * Tells whether or not the any of the files in the list has a changed one
     *
     * @param files
     * @returns {*}
     */
    hasChangedFile: function(files) {
      for(var file in files) {
        if(changedFilesKeys.indexOf(path.relative(__dirname, files[file])) !== -1) {
          return true;
        }
      }

      return false;
    },

    /**
     * Determines if the passed in files list is the same list of files used the last time the compiled files was generated
     *
     * @param originalFileName
     * @param files
     * @returns {boolean}
     */
    hasSameFiles: function(originalFileName, files) {
      var hasSameFiles;

      if(!lastBuildMetaData['buildFiles'] || !lastBuildMetaData['buildFiles'][originalFileName]) {
        hasSameFiles = false;
      }

      for(var file in files) {
        if(!lastBuildMetaData['buildFiles'][originalFileName] || lastBuildMetaData['buildFiles'][originalFileName].indexOf(path.relative(__dirname, files[file])) === -1) {
          hasSameFiles = false;
        }
      }

      if(hasSameFiles !== false) {
        hasSameFiles = files.length === lastBuildMetaData['buildFiles'][originalFileName].length;
      }

      //if it is not the same, remove the stored files since it will be rebuilt anyways
      if(hasSameFiles === false) {
        lastBuildMetaData['buildFiles'][originalFileName] = [];
      }

      return hasSameFiles;
    },

    /**
     * Returns all the compiled files that used the files of files during the last build
     *
     * @param files
     * @returns {Array}
     */
    getCompiledFiles: function(files) {
      var filePaths = [];

      for(file in files) {
        _.forEach(currentBuildMetaData['buildFiles'], function(fileSet, buildFile) {
          if(_.indexOf(fileSet, files[file].replace(__dirname + '/', '')) !== -1 && _.indexOf(filePaths, buildFile) === -1) {
            filePaths.push(buildFile);
          }
        });
      }

      return filePaths;
    },

    /**
     * Generates a sha1 hash of the contents of a files
     *
     * @param filePath
     * @returns {*}
     */
    getFileHash: function(filePath) {
      var shasum = crypto.createHash('sha1');

      if(fs.existsSync(filePath)) {
        return shasum.update(fs.readFileSync(filePath, 'ascii')).digest('hex');
      } else {
        return false;
      }
    },

    /**
     * Adds meta data information for the build
     *
     * @param filePath
     * @param compiledFilePath
     * @param originalFileName
     */
    addBuildMetaDataFile: function(filePath, compiledFilePath) {
      filePath = path.relative(__dirname, filePath);

      currentBuildMetaData['workingFiles'][filePath] = {
        //a hash of the file is probably a more accurate way of determine if the file has changed than last modified datetime
        fileHash: this.getFileHash(filePath)
      };

      if(!currentBuildMetaData['buildFiles']) {
        currentBuildMetaData['buildFiles'] = {};
      }

      if(!currentBuildMetaData['buildFiles'][compiledFilePath]) {
        currentBuildMetaData['buildFiles'][compiledFilePath] = [];

        if(lastBuildMetaData['buildFiles']) {
          lastBuildMetaData['buildFiles'][compiledFilePath] = [];
        }
      }

      if(_.indexOf(currentBuildMetaData['buildFiles'][compiledFilePath], filePath) === -1) {
        currentBuildMetaData['buildFiles'][compiledFilePath].push(filePath);
      }
    },

    hasWorkingFiles: function() {
      return lastBuildMetaData['workingFiles'] && Object.keys(lastBuildMetaData['workingFiles']).length > 0;
    },

    writeFile: function() {
      console.log(('writing out build meta data file ' + buildMetaDataFilePath).green);
      fs.writeFileSync(buildMetaDataFilePath, JSON.stringify(currentBuildMetaData, null, 2), 'ascii');
    }
  };
}());

module.exports = function(grunt) {
  timer.init(grunt);
  var globalConfig = {
    webRoot: 'web', //relative path from this directory
    appRoot: 'app' //relative path from web root
  };
  var bowerCopyFiles = {
    'lodash/dist/lodash.min.js': 'lodash/dist/lodash.min.js',
    'jshashes/hashes.js': 'jshashes/hashes.js',
    'moment/moment.js': 'moment/moment.js',
    'jquery/jquery.js': 'jquery/jquery.js',
    'angular/angular.js': 'angular/angular.js',
    'angular-ui-router/release/angular-ui-router.js': 'angular-ui-router/release/angular-ui-router.js',
    'angular-mockable-http-provider/mockable-http-provider.js': 'angular-mockable-http-provider/mockable-http-provider.js',
    'angular-mocks/angular-mocks.js': 'angular-mocks/angular-mocks.js'
  };
  var librariesCombineFiles = [
    'components/jshashes/hashes.js',
    'components/moment/moment.js',
    'components/jquery/jquery.js',
    'components/angular/angular.js',
    'components/angular-ui-router/release/angular-ui-router.js'
  ];
  var uiTestingCombineFiles = [
    'components/angular-mockable-http-provider/mockable-http-provider.js'
  ];
  var applicationCombineFiles = [
    'app/application.js',
    'app/templates.js',
    'app/components/core/module.js',
    'app/components/core/template-interceptor.js',
    'app/components/home/module.js',
    'app/components/home/home.js'
  ];
  grunt.initConfig({
    globalConfig: globalConfig,
    build: {
      path: '<%= globalConfig.webRoot %>',
      buildPath: 'build',
      combineAssets: {
        default: {
          'app/build/libraries.js': librariesCombineFiles,
          'app/build/application.js': applicationCombineFiles
        },
        uiTesting: {
          'app/build/libraries.js': librariesCombineFiles,
          'app/build/application.js': applicationCombineFiles,
          'app/build/ui-testing.js': uiTestingCombineFiles
        }
      },
      rewriteAssets: {
        fileTypes: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css']/*,
        prependSlash: true,
        //use multiple domains
        domains: [
          'http://static1.exmaple.com',
          'http://static2.exmaple.com'
        ],
        use single domain
        domains: 'http://static.example.com'*/
      }
    },
    watch: {
      buildDevelopment: {
        files: [
          '*.*',
          'web/app/**/*.*',
          'web/components/**/*.*',
          'web/index-builder.html'
        ],
        tasks: ['build-development'],
        options: {
          nospawn: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files: {
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/styles/main.css': [
            '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/styles/main.scss'
          ]
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma/unit-tests.phantom.js'
      }
    },
    complexity: {
      //these value should ensure no error as these settings are just for reference (to compare maintainability of the difference piece of code)
      reference: {
        src: [
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/application.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/misc/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/models/**/*.js'
        ],
        options: {
          cyclomatic: 10,
          halstead: 20,
          maintainability: 80
        }
      },
      defaults: {
        src: [
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/application.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/misc/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/models/**/*.js'
        ]
      }
    },
    jshint: {
      all: {
        src: [
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/application.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/misc/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/components/**/*.js',
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/models/**/*.js'
        ],
        options: {
          bitwise: true, //prevent bitwise operations as they're usually not needed
          camelcase: true, //force variable/member name to be camelCased
          curly: true, //force curly braces around all conditionals
          eqeqeq: true, //for ===/!== instead of ==/!=
          es3: false, //we support ES5 and above, no need for this
          forin: true, //for in loops should make sure to filter items to not get prototype data
          immed: true, //immediate function invocations need to be wrapped in parentheses for readability
          indent: 2, //all application should should be indenting 2 spaces
          latedef: true, //make sure variables are define before use for readability
          newcap: true, //function constructors should be PascalCase
          noarg: true, //this is a work around for a problem that no longer exists
          noempty: true,
          nonew: false, //while we should prefer prototypal inheritance, I am no convince the there is no reason not to use function constructors
          plusplus: true, //just use += 1 or -= 1 for readability
          quotmark: false, //since sometimes you need either double or single quote inside the signle, both should be allowed to avoid havingt to escape
          undef: true, //there is on reason to use an undefined variable
          unused: false,
          strict: false, //not stardard enough to safely use I think
          trailing: true, //there is no reason to have a trailing space
          maxparams: 20, //set so high because of DI with angular can cause a lot of parameters but should never be more then 20
          maxdepth: 3, //more than 3 levels of depth for a function and we should look at refacting the code
          maxstatements: 40, //more than 40 statements per function and we should look at refactoring the code
          maxlen: 160, //line should be no longer than 160 characters
          asi: false, //we always want to show semi-solon warnings
          boss: false, //we always want to show warnings about assignments happening where comparisons are expected
          debug: false, //we should never have debugger code when linting code (which should only happen when building for for production)
          eqnull: false, //we want to show warnings where we have == null to make it more defined to prevent weird things from happening
          esnext: false, //we are not using ES6 code
          evil: false, //we should not be using eval
          expr: false, //we want to should warning where we have expressions and are expecting assignments/function calls
          funcscope: true, //we can declare variable anywhere we want, I don't think there is any real disadvantage (and ES6 is getting block level scope)
          globalstrict: true, //not sure what this is so let not worry about it
          iterator: false, //__iterator__ is not available in all browsers so it should not be used
          lastsemic: false, //we want to know about missing semi-colon everywhere they should be
          laxbreak: true, //allows line breaks anywhere you want
          laxcomma: false, //commas should never be at the beginning of the line,
          loopfunc: false, //this can help identifiy place where a closure need to be added to avoid bugs
          moz: false, //we are not using mozillajavascript extensions
          multistr: false, //there is no reasn for multi-lines strings
          proto: false, //sticking with what I think is the default
          scripturl: false, //sticking with what I think is the default
          smarttabs: false, //sticking with what I think is the default
          shadow: false, //sticking with what I think is the default
          sub: true, //allows array accessor where dot notation might be cleaner (obj['test'] vs obj.test)
          supernew: false, //sticking with what I think is the default
          validthis: true, //strict mode related so we don't need to warnings to show up

          //helps define some globals
          browser: true,
          jquery: true,

          globals: {
            //library/helper globals
            '_': false, // lodash's global
            'angular': false, // angular's global

            //testing globals
            'it': false,
            'expect': false,
            'describe': false,
            'beforeEach': false,
            'module': false,
            'inject': false
          }
        }
      }
    },
    ngtemplates: {
      app: {
        src: [
          '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/**/*.html'
        ],
        dest: '<%= globalConfig.webRoot %>/<%= globalConfig.appRoot %>/templates.js',
        options: {
          module: 'app',
          url: function(a) {
            console.log(a.replace(globalConfig.webRoot + '/', ''));
            return a.replace(globalConfig.webRoot + '/', '');
          },
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      default: {
        options: {
          destPrefix: 'web/components'
        },
        files: bowerCopyFiles
      }
    },
    shell: {
        bower: {
            options: {
                stdout: true,
                stderr: true
            },
            command: 'bower install'
        }
    }
  });

  var recursiveWalk = function(directory, files) {
    var files = files || [];

    fs.readdirSync(directory).forEach(function(item) {
      var fullItemPath = directory + '/' + item;

      if(fs.statSync(fullItemPath).isDirectory()) {
        recursiveWalk(fullItemPath, files);
      } else {
        files.push(fullItemPath);
      }

    });

    return files;
  };

  var recursiveWalkDirectories = function(directory, files) {
    var files = files || [];

    fs.readdirSync(directory).forEach(function(item) {
      var fullItemPath = directory + '/' + item;

      if(fs.statSync(fullItemPath).isDirectory()) {
        recursiveWalk(fullItemPath, files);
      } else {
        files.push(fullItemPath);
      }

    });

    return files;
  };

  //load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('bower-install', [
    'shell:bower',
    'bowercopy'
  ]);

  grunt.registerTask('build-development', [
    'sass',
    'ngtemplates:app',
    'combine-assets:default',
    'rewrite-assets:default'
  ]);

  grunt.registerTask('build-ui-testing', [
    'sass',
    'ngtemplates:app',
    'combine-assets:ui-testing',
    'rewrite-assets:ui-testing'
  ]);

  grunt.registerTask('build-production', [
    'jshint',
    'sass',
    'karma',
    'ngtemplates:app',
    'combine-assets:default',
    'rewrite-assets:default',
    'complexity:reference'
  ]);

  buildMetaData.initialize(__dirname + '/build-meta-data.json');

  grunt.registerTask('combine-assets', 'Combines assets files (just works with javascript files right now)', function() {
    //when deleting build files, lets not delete these
    var dontDeleteFiles = ['.svn', '.git', '.gitignore', '.gitkeep'];
    var combineType = this.args[0] || 'default';
    function buildJavascriptFiles(files, destinationFile) {
      function buildCompiledFile(files, destinationFile, originalFileName) {
        if(!buildMetaData.hasWorkingFiles() && fs.existsSync(path.dirname(destinationFile))) {
          var items = fs.readdirSync(path.dirname(destinationFile));

          for(var z = 0; z < items.length; z += 1) {
            if(dontDeleteFiles.indexOf(items[z]) === -1) {
              console.log(('removing file ' + path.dirname(destinationFile) + '/' + items[z]).yellow);
              rimraf.sync(path.dirname(destinationFile) + '/' + items[z]);
            }
          }
        }

        //need to update the build meta data
        var fileList = [];
        files.forEach(function(filePath){
          fileList.push(filePath.replace(__dirname + '/', ''));
          buildMetaData.addBuildMetaDataFile(filePath, destinationFile);
        });

        var sourceMapFileName = originalFileName + '.map';
        var sourceMapDestination = __dirname  + "/" + grunt.config.get('build').path + '/source/' + sourceMapFileName;

        //make sure source maps directory exists
        if(!fs.existsSync(path.dirname(sourceMapDestination))) {
          mkdirp.sync(path.dirname(sourceMapDestination));
        } else {
          rimraf.sync(sourceMapDestination);
        }

        //make sure build directory exists
        if(!fs.existsSync(path.dirname(destinationFile))) {
          mkdirp.sync(path.dirname(destinationFile));
        } else {
          rimraf.sync(destinationFile);
        }

        console.log(('combining files:\n' + fileList.join('\n') + '\n' + 'into:\n' + destinationFile + '\n').green);

        var minSource = uglifyjs.minify(fileList, {
          outSourceMap: sourceMapFileName,
          sourceRoot: '/'
        });

        //not sure the best way to do this but since grunt is executed one directory up from the web root, I have to the web root directory from the sources
        //todo: see if there is a better way to do this
        var mappingData = JSON.parse(minSource.map);
        mappingData.sources = _.map(mappingData.sources, function(path) {
          return path.replace(globalConfig.webRoot + '/', '');
        });
        var mappingDataSource = JSON.stringify(mappingData);

        fs.appendFileSync(destinationFile, minSource.code + "\n" + '//# sourceMappingURL=/source/' + sourceMapFileName, 'ascii');
        fs.appendFileSync(sourceMapDestination, mappingDataSource, 'ascii');
      };

      var shasum = crypto.createHash('sha1');
      var fileHashPrefix = shasum.update(new Date().getTime() + destinationFile).digest('hex');
      var parser = uglifyjs.parser;
      var uglify = uglifyjs.uglify;
      var source, minSource;
      var originalFileName = path.basename(destinationFile);
      var changedFile = buildMetaData.hasChangedFile(files);
      var compiledFiles = buildMetaData.getCompiledFiles(files);

      //invalidate the compile files if the files have changed
      if(changedFile === true) {
        for(compiledFile in compiledFiles) {
          console.log(('invalidating ' + compiledFiles[compiledFile]).yellow);
          buildMetaData.invalidateBuildFile(compiledFiles[compiledFile]);
        }
      }

      var sameFiles = buildMetaData.hasSameFiles(destinationFile, files);

      if(changedFile || !sameFiles) {
        if(fs.existsSync(destinationFile)) {
          console.log(('removing file ' + destinationFile).yellow);
          rimraf.sync(destinationFile);
        }

        buildCompiledFile(files, destinationFile, originalFileName);
      } else if(!changedFile && sameFiles && !fs.existsSync(destinationFile)) {
        buildCompiledFile(files, destinationFile, originalFileName);
      } else {
        destinationFile = compiledFiles[0];
      }

      return destinationFile;
    };

    var combineAssets = grunt.config.get('build').combineAssets[lingo.camelcase(combineType.replace('-', ' '))];

    _.forEach(combineAssets, function(item, key) {
      //add the web root directory to the file paths
      item = _.map(item, function(path) {
        return __dirname + '/' + globalConfig.webRoot + '/' + path;
      });

      buildJavascriptFiles(item, globalConfig.webRoot + '/' + key);
    });

    //todo: convert to method
    buildMetaData.writeFile();
  });

  //todo: this should just be a different target for the main build task
  grunt.registerTask('rewrite-assets', 'Rewrites urls for assets to prevent caching issues', function() {
    var rewriteType = this.args[0] || 'default';
    var rewriteAssetsConfig = grunt.config.get('build').rewriteAssets;

    if(rewriteAssetsConfig) {
      function getRewriteAssetsPath(asset, fullPath) {
        var fileStats = fs.statSync(fullPath);
        var assetParts = asset.split('/');
        var spliceStart = 0;

        assetParts.splice(spliceStart, 0, 'static', moment(fileStats.mtime).unix());

        return assetParts.join('/');
      };

      var rewritableAssetExtensions = _.map(rewriteAssetsConfig.fileTypes, function(item) {
        return '.' + item;
      });

      var allAssets = recursiveWalk(__dirname + '/' + grunt.config.get('globalConfig').webRoot);
      var rewriteAssets = [];

      allAssets.forEach(function(item) {
        if(rewritableAssetExtensions.indexOf(path.extname(item)) !== -1) {
          rewriteAssets.push(item);
        }
      });

      var filesToProcess = [];

      //todo: can we make this part of the config
      if(rewriteType === 'default') {
        filesToProcess = recursiveWalk(__dirname + '/' + grunt.config.get('globalConfig').webRoot + '/' + grunt.config.get('globalConfig').appRoot + '/' + grunt.config.get('build').buildPath);

        filesToProcess.push(__dirname + '/' + grunt.config.get('globalConfig').webRoot + '/index.html');
      } else if(rewriteType === 'ui-testing') {
        filesToProcess =[__dirname + '/' + grunt.config.get('globalConfig').webRoot + '/index-ut.html'];
      } else {
        console.log(("No proper rewrite type given, use 'default' or 'ui-testing'").red);
      }

      var currentDomainKey = 0;
      var maxDomainKey;

      if(_.isString(rewriteAssetsConfig.domains)) {
        rewriteAssetsConfig.domains = [rewriteAssetsConfig.domains];
      } else if(!_.isArray(rewriteAssetsConfig.domains)) {
        rewriteAssetsConfig.domains = [];
      }

      maxDomainKey = rewriteAssetsConfig.domains.length - 1;

      filesToProcess.forEach(function(file) {
        var fileContents = fs.readFileSync(file, 'ascii');

        rewriteAssets.forEach(function(asset) {
          var fullPath = asset;
          asset = asset.replace(__dirname + '/' + grunt.config.get('globalConfig').webRoot + '/', '');

          var regex = new RegExp('((http[s]?:)?//[a-zA-Z0-9-_.]*.[a-zA-Z0-9-_]*.[a-zA-Z0-9-_]{2,6})?/?((static/[0-9]*/)+)?' + asset, 'g');
          var rewrittenPath = getRewriteAssetsPath(asset, fullPath);

          //see if we should set the full url or just leave it as a relative path
          if(rewriteAssetsConfig.domains.length > 0) {
            rewrittenPath = rewriteAssetsConfig.domains[currentDomainKey] + '/' + rewrittenPath;

            if(maxDomainKey > 0 && currentDomainKey >= maxDomainKey) {
              currentDomainKey = 0;
            } else if(maxDomainKey > 0 && _.isArray(fileContents.match(regex))) {
              currentDomainKey += 1;
            }
          } else if(rewriteAssetsConfig.prependSlash !== false) {
            rewrittenPath = '/' + rewrittenPath;
          }

          fileContents = fileContents.replace(regex, rewrittenPath);
        });

        console.log(('rewriting assets in ' + file).green);
        fs.writeFileSync(file, fileContents, 'ascii');
      });
    }
  });
};

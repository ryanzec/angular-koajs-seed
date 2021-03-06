var gulpConfig = {
  webPath: 'web',
  appPath: 'web/app',
  buildPath: 'web/build',
  vendorComponentsPath: 'web/components',
  compileFiles: {
    javascript: {
      'ui-testing.js': [
        'web/components/angular-mockable-http-provider/mockable-http-provider.js'
      ],
      'application.js': [
        'web/app/application.js',
        'web/app/components/**/module.js',
        'web/app/components/**/*.js',
        //dopn't include test with compiled file
        '!web/app/**/*.spec.js'
      ],
      'libraries.js': [
        'web/components/jshashes/hashes.js',
        'web/components/moment/moment.js',
        'web/components/jquery/dist/jquery.js',
        'web/components/angular/angular.js',
        'web/components/angular-ui-router/release/angular-ui-router.js'
      ]
    },
    sass: {
      'web/app/styles/main.scss': 'web/build/main.css'
    }
  },
  sourceFiles: {
    javascript: [
      'web/app/application.js',
      'web/app/components/**/*.js',
      '!web/app/components/**/*.spec.js'
    ],
    html: [
      'web/*.html',
      'web/components/**/*.html',
      'web/app/components/**/*.html'
    ],
    sass: [
      'web/app/**/*.scss',
      'web/components/**/*.scss'
    ],
    jade: [
      'web/app/components/**/*.jade',
      'web/*.jade'
    ]
  },
  bowerCopy: [
    'lodash/dist/lodash.min.js',
    'jshashes/hashes.js',
    'moment/moment.js',
    'jquery/dist/jquery.js',
    'angular/angular.js',
    'angular-ui-router/release/angular-ui-router.js',
    'angular-mockable-http-provider/mockable-http-provider.js',
    'angular-mocks/angular-mocks.js'
  ],
  tasks: {
    staticRewrite: {
      fileTypesToRewrite: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg', 'js', 'css', 'map', 'html'],
      fileTypesToProcess: ['html', 'css', 'js'],
      assetPaths: ['app', 'components', 'build'],
      prependSlash: true,
      domains: [],
      //any resources that ends in .html that can't be found will search for a file of the same name that ends in .jade for meta data (to determine hash)
      preprocessors: {
        '.html': '.jade'
      },
      assetPatterns: [
        'web/*.html',
        'web/app/**/*.*',
        'web/components/**/*.*',
        //test files should not trigger static rewrite
        '!web/app/**/*.spec.js'
      ]
    },
    copyStaticAssets: {
      staticAssetExtensions: ['svg', 'eot', 'ttf', 'woff', 'png', 'gif', 'jpeg', 'jpg'],
      staticAssetFolders: [
        'web/components',
        'web/app/components'
      ]
    }
  }
};

module.exports = gulpConfig;

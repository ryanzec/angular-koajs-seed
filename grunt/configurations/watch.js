module.exports = {
  sass: {
    files: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/**/*.scss',
      '<%= globalConfig.webPath %>/components/**/*.scss'
    ],
    tasks: [
      'sass',
      'rewrite-assets:default'
    ],
    options: {
      nospawn: true
    }
  },
  javascript: {
    files: [
      '<%= globalConfig.webPath %>/<%= globalConfig.appPath %>/**/*.js',
      '<%= globalConfig.webPath %>/components/**/*.js'
    ],
    tasks: [
      'combine-assets:default',
      'rewrite-assets:default'
    ],
    options: {
      nospawn: true
    }
  },
  html: {
    files: [
      '<%= globalConfig.webPath %>/**/*.html'
    ],
    tasks: [
      'rewrite-assets:default'
    ],
    options: {
      nospawn: true
    }
  }
}
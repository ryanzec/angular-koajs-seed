module.exports = {
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
}
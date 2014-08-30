# Change Log

## master

This version now requires AngularJS 1.3.0-RC.0+ and Sass 3.4+.

- updated bower/npm packages
- added/updated gulp tasks for Jade.js support
- updated gulp sass task to account for changes in Sass 3.4.x
- added support for working with processors in the gulp static rewrite task

This is specifically added as I experiment with using Jade.js for templates.  Instead of including templates like this:

```javascript
$stateProvider
.state('app.home', {
  url: '/home',
  abstract: true,
  views: {
    '': {
      templateUrl: '/app/components/core/assets/templates/module-wrapper.jade'
    }
  }
});
```

or

```jade
div(ng-include='"/app/components/core/assets/templates/module-wrapper.jade"')
```

you can write this:

```javascript
$stateProvider
.state('app.home', {
  url: '/home',
  abstract: true,
  views: {
    '': {
      templateUrl: '/app/components/core/assets/templates/module-wrapper.html'
    }
  }
});
```

or

```jade
div(ng-include='"/app/components/core/assets/templates/module-wrapper.html"')
```

which is more logical since angular will be working with the HTML generated from Jade anyways.

This workflow is a work in progress and might change.

- added javascript snippet to index pages to show full errors

There is an issue (with at least Chrome) that error messages from AngularJS get cutoff and end with ... which can make debugging pretty hard.  I ahve added a JavaScript snippet that will display full errors properly.

- updated code to account for changes in AngularJS 1.3.x
- added .editorconfig

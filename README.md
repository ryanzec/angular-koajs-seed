# AngularJS/KoaJS Seed #

This is a seed for an AngularJS and ExpressJS application.  This setup should allow you to get an application quickly up a running all locally with a computer that has NodeJS installed on it.

## Setup ##

Since this uses KoaJS, It requires generator support so you need to use use Node version v0.11.9+.

This also generate source maps for SASS so SASS 3.3+ needs to be installed.

* Download the repository
* Make sure you have the following npm packages installed globally:
  * gulp
  * bower
  * karma (if you want you do unit testing, and you SHOULD)
  * dalek-cli (if you wanted to do UI unit testing/integration testing, and you should)
* Run the commands npm install && bower install
* Go to the web folder and run node koa.js (this will serve the index-dev.html file)

## What Does It Have ##

Here is what is included so far.  As I continue to belong more with AngularJS and KoaJS, this project will continually be updated.

* Includes a basic structure for angular applications that has worked for me
* This uses Gulp and Bower for a lot of the work
* Includes custom build meta data system (to be smart about building files) and a custom static asset rewriter (to allow for indefinite caching of files), everything else uses 3rd party gulp plugins.
## License ##

MIT

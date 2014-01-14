# AngularJS/KoaJS Seed #

This is a seed for an AngularJS and ExpressJS application.  This setup should allow you to get an application quickly up a running all locally with a computer that has NodeJS installed on it.

## Setup ##

Since this uses KoaJS, It requires generator support so you need to use use Node version v0.11.9+.

* Download the repository
* Make sure you have the following npm packages installed globally:
  * grunt-cli
  * bower
  * karma (if you want you do unit testing, and you SHOULD)
  * dalek-cli (if you wanted to do UI unit testing/integration testing, and you should)
* Run the commands npm install && bower install
* Go to the web folder and run node koa.js (this will serve the index-dev.html file)

## What Does It Have ##

Here is what is included so far.  As I continue to belong more with AngularJS and KoaJS, this project will continually be updated.

* Includes a basic structure for angular applications that has worked for me
* This uses Grunt and Bower for a lot of the work
* Includes a number of custom grunt commands (will look into using existing grunt plugins or converting my commands to plugins at some point)

## Grunt ##

There are also a few of custom grunt commands included in this:

* High Level Commands:
  * build-production - Runs all required command required for building a production version of the application (building index HTML file, rewriting assets, runs unit tests, etc...)
  * build-ui-testing -  Runs all required command required for building a UI unit testing version of the application (building index HTML file, rewriting assets, compile SASS code, etc...)
* Low Level Commands:
  * build - Builds production/UI unit testing versions of the index HTML file
  * rewrite-assets - Go through the code and rewrite assets to include timestamps in the URIs to prevent caching issues

## License ##

MIT
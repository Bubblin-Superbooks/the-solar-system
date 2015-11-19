var 
  source = require('vinyl-source-stream'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),    
  browserify = require('browserify'),
  babelify = require('babelify'),
  watchify = require('watchify'),
  notify = require('gulp-notify'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  buffer = require('vinyl-buffer'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  historyApiFallback = require('connect-history-api-fallback'),
  jshint = require('gulp-jshint');



var require_dir = require('require-dir');
require_dir('./tasks');


/* Errors */

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}



function buildBodyScript(file, watch) {
  var props = {
    entries: ['./source/scripts/' + file],
    debug : true,
    transform:  [babelify.configure({compact : false})]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(rename('body.min.js'))
      .pipe(gulp.dest('./build/source/scripts/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundling...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildBodyScript('body.js', false); // this will run once because we set watch to false
});


// run 'scripts' task first, then watch for future changes
gulp.task('default', ['images','styles','scripts','browser-sync'], function() {
  gulp.watch('source/css/**/*', ['styles']); 
  return buildBodyScript('body.js', true); 
});
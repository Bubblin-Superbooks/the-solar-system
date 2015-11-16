var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')


/* Styles Task */

gulp.task('styles',function() {
  // move over fonts
  // gulp.src('source/css/fonts/**.*')
  //   .pipe(gulp.dest('build/source/css/fonts'))

  // Compile CSS
  gulp.src('source/css/style.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/source/css/'))
    .pipe(reload({stream:true}))
});

/*
  Images
*/
gulp.task('images',function(){
  gulp.src('source/images/**')
    .pipe(gulp.dest('./build/source/images'))
});

/* Browser Sync */
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

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
    entries: ['./source/scripts/body/' + file],
    debug : true,
    transform:  [babelify.configure({stage : 0, compact : false})]
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
      .pipe(gulp.dest('./build/source/scripts/body/'))
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


function buildHeadScript(file, watch) {
  var props = {
    entries: ['./source/scripts/head/' + file],
    debug : true,
    transform:  [babelify.configure({stage : 0, compact : false})]
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
      .pipe(rename('head.min.js'))
      .pipe(gulp.dest('./build/source/scripts/head/'))
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
  return buildHeadScript('head.js', false); // this will run once because we set watch to false
});


// run 'scripts' task first, then watch for future changes
gulp.task('default', ['images','styles','scripts','browser-sync'], function() {
  
  gulp.watch('source/css/**/*', ['styles']); 
  return buildBodyScript('body.js', true); 
  return buildHeadScript('head.js', true); 
});
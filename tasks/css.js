var 
  gulp = require('gulp'),
  gutil = require('gulp-util'),    
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),  
  reload = browserSync.reload;


/* Styles Task */

gulp.task('styles',function() {
  // Fonts
  // gulp.src('source/css/fonts/**.*')
  //   .pipe(gulp.dest('build/source/css/fonts'))

  // Compile CSS
  gulp.src('source/css/style.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/source/css/'))
    .pipe(reload({stream:true}))
});

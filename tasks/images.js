/* Images */

var 
  gulp = require('gulp'),
  gutil = require('gulp-util');


gulp.task('images',function(){
  gulp.src('source/images/**')
    .pipe(gulp.dest('./build/source/images'))
});

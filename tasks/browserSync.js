/* Browser Sync */

var 
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  browserSync = require('browser-sync'),
  historyApiFallback = require('connect-history-api-fallback');


gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

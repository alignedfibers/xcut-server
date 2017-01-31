var gulp = require('gulp');
var customProps = require('../index.js');

gulp.task('default', function() {
  return gulp.src('./file.css')
    .pipe(customProps())
    .pipe(gulp.dest('dist'));
});

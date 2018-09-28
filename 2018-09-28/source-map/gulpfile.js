var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function() {
    gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('./dist'));
  });
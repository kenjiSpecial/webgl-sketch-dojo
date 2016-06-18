var gulp  = require('gulp');
var uglify = require('gulp-uglify');

console.log(gulp);
gulp.src('example/bundle.js')
    // .pipe(uglify())
    .pipe(gulp.dest('app'));

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var input = './public/styles/sass/*.scss';
var output = './public/styles/';

gulp.task('sass', function() {
    gulp.src(input)
        .pipe(sass())
        .pipe(gulp.dest(output));
});

gulp.task('default', function() {
    gulp.watch(input, ['sass']);
});
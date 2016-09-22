/* jshint node: true */

var gulp = require('gulp');

var reduce = require('./');

gulp.task('test', function () {
    return gulp.src('./*')
    .pipe(reduce(function (memo, content, file, next) {

        console.log(file.path);
        console.log(file.base);
        console.log('-------------------');

        next(null, memo + file.path + ',');
    }, '')).on('data', function(data) {
        console.log(data);
    });
});

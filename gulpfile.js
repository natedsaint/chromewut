var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jasmine = require('gulp-jasmine'),
    markdown = require('gulp-markdown');

var filePaths = [
    'lib/jquery.min.js',
    'lib/alert.js',
    'lib/WutController.js',
    'lib/AlertController.js',
    'lib/startup.js'
];

gulp.task('minify',function() {
    return gulp.src(filePaths)
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('dev',function() {
    return gulp.src(filePaths)
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('readme',function() {
    return gulp.src('README.md')
        .pipe(markdown())
        .pipe(gulp.dest('./docs/'));
});

gulp.task('test',function() {
    return gulp.src('spec/wuttest.js')
        .pipe(jasmine());
});

gulp.task('default',['minify','readme']);
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jasmine = require('gulp-jasmine'),
    markdown = require('gulp-markdown'),
    coverage = require('gulp-coverage');

var filePaths = [
    'web/jquery.min.js',
    'lib/WutController.js',
    'lib/AlertController.js',
    'web/startup.js'
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
        .pipe(coverage.instrument({
            pattern: ['lib/*.js'],
            debugDirectory: 'debug'
        }))
        .pipe(jasmine())
        .pipe(coverage.gather())
        .pipe(coverage.format())
        .pipe(gulp.dest('reports'));
});

gulp.task('default',['minify','readme']);

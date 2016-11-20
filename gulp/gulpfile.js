//require
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var fileinclude = require('gulp-file-include');
var cache = require('gulp-cached');
var del = require('del');
var cfg = require('./setting.json');

//setting
var reload = browserSync.reload;
var compressSass = cfg.needCompressSass ? 'compressed' : 'uncompressed';

gulp.task('sass', function() {
    return gulp.src(cfg.initDir + '/scss/**/*.scss')
    .pipe(sass({outputStyle: compressSass}).on('error', sass.logError))
    .pipe(gulp.dest(cfg.targetDir + '/css'))
    .pipe(reload({ stream:true }));
});

gulp.task('include', function() {
    return gulp.src(cfg.initDir + '/**/*.html')
    .pipe(cache('include'))
    .pipe(fileinclude())
    .pipe(gulp.dest(cfg.targetDir + '/'))
    .pipe(reload({ stream:true }));
})

gulp.task('uglify', function() {
    return gulp.src(cfg.initDir + '/**/*.js')
    .pipe(cache('uglify'))
    .pipe(uglify()).
    pipe(gulp.dest(cfg.targetDir + '/'))
    .pipe(reload({ stream:true }));
});

gulp.task('build', ['sass', 'include', 'uglify']);

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: cfg.targetDir
        }
    });

    gulp.watch(['**/*.html'], cfg.watchCwd, ['include']);

    gulp.watch(['**/*.scss'], cfg.watchCwd, ['sass']);

    gulp.watch(['**/*.js'], cfg.watchCwd, ['uglify']);
});


gulp.task('default', ['build'], function() {
    gulp.start('serve');
});

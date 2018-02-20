// Variables

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


// Tasks

gulp.task('browserSync', function () {
    browserSync.init({
      server: {
      baseDir: 'app'
      },
    });
  });

gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest('app/css'))// Converts Sass to CSS with gulp-sass
    .pipe(browserSync.reload({
      stream: true
      }));
  });

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
     })))
    .pipe(gulp.dest('dist/images'))
  });

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  });

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
  });

gulp.task('clean:dist', () => {
    return del.sync('dist');
  });

gulp.task('default', function (callback) {
    runSequence(['watch', 'sass', 'browserSync'],
      callback
    );
  });

gulp.task('build', function (callback) {
    runSequence('clean:dist', ['default', 'images', 'fonts'],
      callback);
 });
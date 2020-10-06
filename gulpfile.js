/**
 * Gulpfile of all tasks that we need for the site to build.
 */

// The settings that we will use throughout.
var settings = {
  inputDir: './source',
  outputDir: './site',
  buildDir: './build',
};

const gulp = require('gulp');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();


gulp.task('js', function(cb) {
  return gulp.src(settings.inputDir + '/js/entry.js')
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'scripts.js',
      }
    }))
    .pipe(gulp.dest(settings.outputDir + '/js/'))
    .pipe(browserSync.stream());;
});

/**
 * Dirty secret, we just need to copy them.
 */
gulp.task('fonts', function() {
  return gulp.src(settings.inputDir + '/fonts/**/*.*')
    .pipe(gulp.dest(settings.outputDir + '/fonts'))
});

/**
 * Compile the Sass for development and inject into the browser.
 */
gulp.task('sass', function() {
  return gulp.src(settings.inputDir + '/sass/**/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer('last 3 versions', '> 1%'))
    .pipe(gulp.dest(settings.outputDir + '/css'))
    .pipe(browserSync.stream());
});

/**
 * Minify all of the images.
 */
gulp.task('images', function() {
  return gulp.src(settings.inputDir + '/images/**/*')
    .pipe($.changed(settings.outputDir + '/images'))
    .pipe($.imagemin())
    .pipe(gulp.dest(settings.outputDir + '/images'))
    .pipe($.webp())
    .pipe(gulp.dest(settings.outputDir + '/images'));
});

/**
 * Compile the HTML to a single page.
 */
gulp.task('html', function() {
  return gulp.src([settings.inputDir + '/*.html'])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: settings.inputDir + '/templates/'
    }))
    .pipe(gulp.dest(settings.outputDir))
    .pipe(browserSync.reload({stream:true}));
});

/**
* Clean all the folders entirely.
*/
gulp.task('clean', function() {
  return gulp.src([settings.outputDir, settings.buildDir], {read: false, allowEmpty: true})
    .pipe($.clean());
 });

 gulp.task('build-js', function(cb) {
  return gulp.src(settings.inputDir + '/js/entry.js')
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'scripts.js',
      }
    }))
    .pipe($.uglify().on('error', function(err) {
      console.log(err.toString());
      process.exit(1);
    }))
    .pipe(gulp.dest(settings.buildDir + '/js/'));
});

/**
 * Dirty secret, we just need to copy them.
 */
gulp.task('build-fonts', function() {
  return gulp.src(settings.inputDir + '/fonts/**/*.*')
    .pipe(gulp.dest(settings.buildDir + '/fonts'))
});

/**
 * Compile the Sass for development and inject into the browser.
 */
gulp.task('build-sass', function() {
  return gulp.src(settings.inputDir + '/sass/**/*.scss')
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer('last 3 versions', '> 1%'))
    .pipe(gulp.dest(settings.buildDir + '/css'));
});

/**
 * Minify all of the images.
 */
gulp.task('build-images', function() {
  return gulp.src(settings.inputDir + '/images/**/*')
    .pipe($.changed(settings.buildDir + '/images'))
    .pipe($.imagemin())
    .pipe(gulp.dest(settings.buildDir + '/images'))
    .pipe($.webp())
    .pipe(gulp.dest(settings.buildDir + '/images'));
});

/**
 * Compile the HTML to a single page.
 */
gulp.task('build-html', function() {
  return gulp.src([settings.inputDir + '/*.html'])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: settings.inputDir + '/templates/'
    }))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(settings.buildDir));
});

/**
 * Build for production. Clean runs first, then will run the rest of the tasks.
 */
gulp.task('build', gulp.series('clean', gulp.parallel('build-fonts', 'build-sass', 'build-js', 'build-html', 'build-images')));


/**
 * Server for development use.
 */
gulp.task('serve',  gulp.parallel(['sass', 'html', 'js', 'images', 'fonts'], function() {
  browserSync.init({
    server: settings.outputDir
  });

  gulp.watch(settings.inputDir + '/sass/**/*.scss', gulp.parallel('sass'));
  gulp.watch(settings.inputDir + '/**/*.html', gulp.parallel('html'));
  gulp.watch(settings.inputDir + '/js/**/*.js', gulp.parallel('js'));
  gulp.watch(settings.inputDir + '/images/**/**', gulp.parallel('images'));
  gulp.watch(settings.inputDir + '/fonts/**/**', gulp.parallel('fonts'));
}));

gulp.task('js-build', function(cb) {
  return gulp.src(settings.inputDir + '/js/entry.js')
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'scripts.min.js',
      }
    }))
    .pipe(gulp.dest(settings.outputDir + '/js/'));
});



/**
 * General compiling tasks.
 */
gulp.task('default', gulp.parallel('serve'));

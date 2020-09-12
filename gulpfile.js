/**
 * Gulpfile of all tasks that we need for the site to build.
 */

// Require Gulp.
var gulp = require('gulp');
var chalk = require('chalk');

// The settings that we will use throughout.
var settings = {
  inputDir: './source',
  outputDir: './site',
  buildDir: './build',
  stagingBucket: 'formerpresidentsfund',
  productionBucket: 'oneamericaappeal',
};

settings.otherFiles = [
  settings.inputDir + '/favicon.ico',
  settings.inputDir + '/**/*.pdf'
];

// Load required components.
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

gulp.task('tasks', $.taskListing);

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
 * Concat all of the JavaScript.
 */
gulp.task('js', function() {

  return gulp.src(settings.inputDir + '/js/entry.js')
    .pipe(webpack({
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      output: {
        filename: 'scripts.js',
      },
    }))
    .pipe(gulp.dest(settings.outputDir + '/js'))
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
 * Compile the HTML to a single page.
 */
gulp.task('html', function() {
  return gulp.src([settings.inputDir + '/*.html'])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: settings.inputDir + '/templates/',
      context: {
        stripe_api_url: 'http://localhost:5000/donate',
        stripe_api_pub_key: 'pk_test_EdqhM2IZ5U4mW0UGm5VY0KGj'
      }
    }))
    .pipe(gulp.dest(settings.outputDir))
    .pipe(browserSync.reload({stream:true}))
    .pipe($.ignore.exclude('!index.html')) // Will allow us to create the
                                           // Mastercard page with only index
                                           // files.
    .pipe(gulp.dest(settings.outputDir + '/mastercard'));
});

/**
 * Minify all of the images.
 */
gulp.task('images', function() {
  return gulp.src(settings.inputDir + '/images/**/*')
    .pipe($.changed(settings.outputDir + '/images'))
    .pipe($.imagemin([
      $.imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(settings.outputDir + '/images'))
    .pipe($.webp())
    .pipe(gulp.dest(settings.outputDir + '/images'));
});

/**
 * Dirty secret, we just need to copy them.
 */
gulp.task('files', ['clean'], function() {
  return gulp.src(settings.otherFiles)
    .pipe(gulp.dest(settings.outputDir))
});


/**
 * Server for development use.
 */
gulp.task('serve', ['sass', 'html', 'js', 'images', 'fonts'], function() {
  browserSync.init({
    server: settings.outputDir
  });

  gulp.watch(settings.inputDir + '/sass/**/*.scss', ['sass']);
  gulp.watch(settings.inputDir + '/**/*.html', ['html']);
  gulp.watch(settings.inputDir + '/js/**/*.js', ['js']);
  gulp.watch(settings.inputDir + '/images/**/**', ['images']);
  gulp.watch(settings.inputDir + '/fonts/**/**', ['fonts']);
});

/**
 * Build for production. Clean runs first, then will run the rest of the tasks.
 */
gulp.task('build', ['clean', 'build-fonts', 'build-css', 'build-js', 'build-html', 'build-images', 'build-files']);

/**
 * Clean all the folders entirely.
 */
gulp.task('clean', function() {
  return gulp.src([settings.outputDir, settings.buildDir], {read: false})
    .pipe($.clean());
});

/**
 * Compile and minify the HTML.
 */
gulp.task('build-html', ['clean', 'build-css', 'build-js'], function() {
  return gulp.src([settings.inputDir + '/*.html'])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: settings.inputDir + '/templates/',
      context: {
        stripe_api_url: 'https://backend.oneamericaappeal.org/donate',
        stripe_api_pub_key: 'pk_live_9EbtgYUT8Hi35pVBgnU1ZFD6'
      }
    }))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.inline({
      base: settings.buildDir + '/',
      js: $.uglify,
      css: $.minifyCss,
      disabledTypes: ['svg', 'img']
    }))
    .pipe(gulp.dest(settings.buildDir))
    .pipe($.ignore.exclude('!index.html')) // Will allow us to create the
                                           // Mastercard page with only index
                                           // files.
    .pipe(gulp.dest(settings.buildDir + '/mastercard'));
});

/**
 * Dirty secret, we just need to copy them.
 */
gulp.task('build-fonts', ['clean'], function() {
  return gulp.src(settings.inputDir + '/fonts/**/*.*')
    .pipe(gulp.dest(settings.buildDir + '/fonts'))
});

/**
 * Dirty secret, we just need to copy them.
 */
gulp.task('build-files', ['clean'], function() {
  return gulp.src(settings.otherFiles)
    .pipe(gulp.dest(settings.buildDir))
});

/**
 * Re-compile and minify the CSS.
 */
gulp.task('build-css', ['clean'], function() {
  return gulp.src(settings.inputDir + '/sass/**/*.scss')
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer('last 3 versions', '> 1%'))
    .pipe(gulp.dest(settings.buildDir + '/css'))
});

/**
 * Concat and minify all of the JavaScript
 */
gulp.task('build-js', ['clean'], function() {
    return gulp.src(settings.inputDir + '/js/entry.js')
      .pipe(webpack({
        module: {
          loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015']
              }
            }
          ]
        },
        output: {
          filename: 'scripts.js',
        },
      }))
      .pipe($.uglify().on('error', function(err) {
        console.log(err.toString());
        process.exit(1);
      }))
      .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Minify all of the images for build.
 */
gulp.task('build-images', ['clean'], function() {
  return gulp.src(settings.inputDir + '/images/**/*')
    .pipe($.changed(settings.buildDir + '/images'))
    .pipe($.imagemin([
      $.imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(settings.buildDir + '/images'))
    .pipe($.webp({quality: 85}))
    .pipe(gulp.dest(settings.buildDir + '/images'));
});

var s3MetadataFunction = function(keyname) {
  var length = 60 * 60 * 24 * 365;

  if (keyname.endsWith('html')) {
    length = 60 * 60 * 24;
  }

  return {
    'x-amz-meta-surrogate-key': 'max-length=' + length,
    'Cache-Control': 'max-age=' + length
  }
};

/**
 * Deploy to production.
 */
gulp.task('publish', ['build'], function() {
  var s3 = $.s3Upload();

  gulp.src(settings.buildDir + '/**')
    .pipe($.confirm({
      question: `You are deploying to ${chalk.black.bgRed('PRODUCTION')} are you sure you want to continue? (Press 'Y' and enter)`,
      input: 'Y'
    }))
    .pipe(s3({
      Bucket: settings.productionBucket,
      ACL: 'public-read',
      maps: {
        Metadata: s3MetadataFunction,
      }
    }, {
      maxRetries: 3
    }));
});

/**
 * Deploy to staging.
 */
gulp.task('publish-staging', ['build'], function() {
  var s3 = $.s3Upload();

  gulp.src(settings.buildDir + '/**')
    .pipe($.confirm({
      question: `You are deploying to ${chalk.black.bgYellow('STAGING')} are you sure you want to continue? (Press 'Y' and enter)`,
      input: 'Y'
    }))
    .pipe(s3({
      Bucket: settings.stagingBucket,
      ACL: 'public-read',
      maps: {
        Metadata: s3MetadataFunction,
      }
    }, {
      maxRetries: 3
    }));
});

/**
 * Default task.
 */
gulp.task('default', ['serve']);

'use strict'

const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  cssmin = require('gulp-cssmin'),
  autoprefixer = require('autoprefixer'),
  maps = require('gulp-sourcemaps'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  imagemin = require('gulp-imagemin'),
  pug = require('gulp-pug'),
  fileinclude = require('gulp-file-include'),
  copy = require('gulp-copy'),
  cached = require('gulp-cached')

const pathDev = {
  root: 'src/',
  js: 'src/js/',
  css: 'src/styles/',
  img: 'src/images/',
  fonts: 'src/fonts/',
  temp: 'src/templates/',
}
const pathOutput = {
  root: 'out',
  js: 'out/js/',
  css: 'out/styles/',
  img: 'out/images/',
  fonts: 'out/fonts/',
}

/* JS - libraries */
gulp.task('Bundle', function () {
  return gulp
    .src([`${pathDev.js}lib/**/*`]) // lib folder
    .pipe(cached('Bundle'))
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(pathOutput.js + 'lib'))
})

/* JS - custom */
gulp.task('Script', function () {
  return (
    gulp
      .src([`${pathDev.js}*.js`])
      .pipe(cached('Script'))
      // .pipe(maps.init())
      // .pipe(concat('main.js'))
      .pipe(
        babel({
          presets: ['@babel/preset-env'],
        })
      )
      // .pipe(uglify())
      // .pipe(
      //   rename({
      //     suffix: '.min',
      //   })
      // )
      // .pipe(maps.write('.'))
      .pipe(gulp.dest(pathOutput.js))
      .pipe(browserSync.stream())
  )
})

/* 
  SCSS/CSS 
*/
gulp.task('Sass', function () {
  return gulp
    .src([`${pathDev.css}main.scss`])
    .pipe(cached('Sass'))
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer('>= 1%', 'ie >= 9')]))
    .pipe(maps.write('.'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(pathOutput.css))
    .pipe(browserSync.stream())
})
/* 
  Minify Css
*/
gulp.task('Css', function () {
  return gulp
    .src(`${pathDev.css}lib/**/*`)
    .pipe(cached('Css'))
    .pipe(maps.init())
    .pipe(postcss([autoprefixer('>= 1%', 'ie >= 9')]))
    .pipe(maps.write('.'))
    .pipe(gulp.dest(`${pathOutput.css}lib`))
    .pipe(browserSync.stream())
})

/* 
  Image Compress 
*/
gulp.task('IMG', function () {
  return gulp
    .src([`${pathDev.img}**/*`])
    .pipe(cached('IMG'))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
      ])
    )
    .pipe(gulp.dest(pathOutput.img))
})

/* 
  Copy Fonts 
*/
gulp.task('Copy', function () {
  return gulp.src([`${pathDev.fonts}**/*`]).pipe(gulp.dest([pathOutput.fonts]))
})

/* 
  Template Pages 
*/
// gulp.task('pug', function () {
//   return gulp
//     .src(`${pathDev.temp}*.+(pug|html)`)
//     .pipe(cached('pug'))
//     .pipe(
//       pug({
//         doctype: 'html',
//         pretty: true,
//       })
//     )
//     .pipe(gulp.dest(pathOutput.root))
//     .pipe(browserSync.stream())
// })

/*
  Include HTML
*/
gulp.task('Include', function () {
  return gulp
    .src([`${pathDev.root}*.html`])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(gulp.dest(pathOutput.root))
    .pipe(browserSync.stream())
})

/* 
  Clean 
*/
gulp.task('clean', function (done) {
  return del(['out']), done()
})

/* 
  BUILD 
*/
gulp.task('build', gulp.series('Copy', 'IMG', 'Bundle', 'Script', 'Sass', 'Css', 'Include'), function () {
  return gulp.src([`${pathDev.root}**/*`]).pipe(gulp.dest(pathOutput.root))
})

/*
  WATCH
*/
gulp.task('watchFiles', function () {
  browserSync.init({
    injectChanges: true,
    server: pathOutput.root,
    open: true,
  })
  gulp.watch(`${pathDev.img}**/*`, gulp.series('IMG'))
  gulp.watch(`${pathDev.js}**/*`, gulp.series('Bundle', 'Script'))
  gulp.watch(`${pathDev.css}**/*`, gulp.series('Sass', 'Css'))
  gulp.watch(`${pathDev.root}*.html`, gulp.series('Include'))
  // gulp.watch(`${pathDev.temp}**/*.+(pug|html)`, gulp.series('pug'))
  gulp.watch(`${pathOutput.root}**/*`).on('change', browserSync.reload)
})

/* gulp start */
gulp.task('cleaning', gulp.series('clean'))
gulp.task('default', gulp.series('watchFiles'))
gulp.task('dist', gulp.series('clean', 'build'))

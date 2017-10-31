'use strict';

const path = require('path');
const gulp = require('gulp');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require( 'imagemin-jpeg-recompress' );
const imageminMozjpeg = require( 'imagemin-mozjpeg' );
const imageResize = require('gulp-image-resize');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// fetch command line arguments
// https://www.sitepoint.com/pass-parameters-gulp-tasks/
const arg = (argList => {

  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {

    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {

      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;

    }
    else {

      // argument name
      curOpt = opt;
      arg[curOpt] = true;

    }

  }

  return arg;

})(process.argv);

console.log(arg);

gulp.task('image', function() {
    return gulp.src(path.join('src', '**/*.{gif,jpg,jpeg,JPG,JPEG,svg,png}'))
        .pipe(imageResize({
          width : arg.width || arg.w || 0,
          height : arg.height || arg.h || 0,
          crop : false,
          upscale : false
        }))
        .pipe($.imagemin([
            imageminJpegRecompress({
              //accurate: true,
              quality: 'high',
              min: 50,
              max: 75,
              strip: true,
              progressive: true
            }),
            imageminMozjpeg({
              progressive: true,
              quality: 75
            }),
            imageminPngquant({
              quality: '0-100',
              speed: 1,
              strip: 1
            }),
            $.imagemin.svgo({cleanupIDs: false})
          ],{
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
          }))
        .pipe(gulp.dest('dst'));
  }
);

gulp.task('default', [], function () {
  gulp.start('image');
});

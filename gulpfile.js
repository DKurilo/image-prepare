'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require( 'imagemin-jpeg-recompress' );
const imageminMozjpeg = require( 'imagemin-mozjpeg' );
const imageResize = require('gulp-image-resize');
const getDimensions = require('get-video-dimensions');
const { exec } = require('child_process');
const mkdirp = require('mkdirp');

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

gulp.task('image', function() {
    return gulp.src(path.join('src', '**/*.{gif,jpg,jpeg,JPG,JPEG,svg,png}'))
        .pipe(imageResize({
          width : arg.width || arg.w || 0,
          height : arg.height || arg.t || 0,
          crop : false,
          upscale : false
        }))
        .pipe($.imagemin([
            imageminJpegRecompress({
              accurate: true,
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

const queue = [];

const getNearestEven = n => Math.round(n / 2) * 2;

const processFolder = (rpath, lpath, opath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(lpath, (err, objs) => {
      const promises = [];
      for (const key in objs) {
        const objPath = path.join(lpath, objs[key]);
        const reg = new RegExp(rpath.replace(/\//g, '\\/').replace(/\\/g, '\\\\'));
        const out = objPath.replace(reg, path.resolve('./', opath));
        promises.push(new Promise((resolvein, rejectin) => {
          fs.stat(objPath, (err, stats) => {
            const isDir = stats.isDirectory();
            if (isDir) {
              mkdirp.sync(out);
              processFolder(rpath, objPath, opath).then(() => {
                resolvein();
              });
            } else {
              if (/^.*\.(mov|MOV|mp4|MP4|AVI|avi|mkv|MKV|ogv|OGV|WEBM|webm)$/.test(objPath)){
                const getDimPromise = getDimensions(objPath);
                const outFileName = out.replace(/\.(mov|MOV|mp4|MP4|AVI|avi|mkv|MKV|ogv|OGV|WEBM|webm)$/, '.mp4');
                getDimPromise.then((dimensions) => {
                  const w = arg.width || arg.w || 0, h = arg.height || arg.t || 0;
                  let vw = dimensions.width, vh = dimensions.height;
                  if ((w > 0 && vw > w) || (h > 0 && vh > h)) {
                    if ( h === 0 && vw > w ) {
                      vh = vh * w / vw;
                      vw = w;
                    } else if ( w === 0 &&  vh > h ) {
                      vw = vw * h / vh;
                      vh = h;
                    } else if ( vw / vh > w / h ) {
                      vh = vh * w / vw;
                      vw = w;
                      if ( vh > h ) {
                        vw = vw * h / vh;
                        vh = h;
                      }
                    } else if ( vw / vh < w / h ) {
                      vw = vw * h / vh;
                      vh = h;
                      if ( vw > w ) {
                        vh = vh * w / vw;
                        vw = w;
                      }
                    }
                  }
                  queue.push({
                    from: objPath,
                    to: outFileName,
                    size: getNearestEven(vw) + 'x' + getNearestEven(vh), // you need to have even sizes for video
                  });
                  resolvein();
                });
              } else {
                resolvein();
              }
            }
          });
        }));
      }
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  });
};

const processQueue = (script) => {
  return new Promise((resolve, reject) => {
    if (queue.length > 0){
      const task = queue.pop();
      console.log(`working on: ${task.from}.`);
      console.log(`${queue.length} in queue.`);
      exec(`call ${script} "${task.from}" "${task.size}" "${task.to}"`, (err, stdout, stderr) => {
        processQueue(script).then(() => {
          if (err) {
            console.log(err);
            console.log(stderr);
          }
          resolve();
        });
      });
    } else {
      resolve();
    }
  });
};

gulp.task('default', [], function () {
  gulp.start('image');
  processFolder(path.resolve('./src'), path.resolve('./src'), 'dst').then(() => {
    console.log(`Need to process: ${queue.length} video files.`);
    let script = 'videoprocess.sh';
    if ( /^win/.test(os.platform()) ) {
      script = 'videoprocess.bat';
    }
    processQueue(script).then(() => {
      console.log('finished');
    });
  });
});

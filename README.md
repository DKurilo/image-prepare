# Image preparing.

Gulp routine to resize and minify images.
You need to do it before use on the site.

## Using

gulp [--width &lt;pixels&gt; --height &lt;pixels&gt;]

## Options

`--width` or `-w` - maximum width
`--height` or `-t` - maximum height

### Notes

Be sure you have ImageMagick installed. This routine uses https://www.npmjs.com/package/gulp-image-resize to resize images.
How to install you can find here: https://www.npmjs.com/package/gulp-image-resize

## Known issues

1. imagemin-pngquant uses pngqunat-bin, and it contains old version of pngquant.exe. I created pull request to fix it: https://github.com/imagemin/pngquant-bin/pull/70
2. imagemin-pngquant doesn't have `--strip` option support. I created pull request to fix it: https://github.com/imagemin/imagemin-pngquant/pull/44

### Workaround
1. copy pngquant.exr from: https://pngquant.org/pngquant-windows.zip to node_modules/pngquant-bin/vendor
2. copy index.js from https://github.com/DKurilo/imagemin-pngquant/blob/master/index.js to node_modules/imagemin-pngquant/

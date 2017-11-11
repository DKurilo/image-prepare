# Image and video preparing.

Gulp routine to resize and minify images and video.
You need to do it before use images and video on a site.

## Using

Upload your folders with images and video into `./src` folder. Then launch:  
`gulp [--width &lt;pixels&gt; --height &lt;pixels&gt;]`
and get processed images and video from `./dst` folder. Your directory structure will be preserved.  

## Options

`--width` or `-w` - maximum width
`--height` or `-t` - maximum height

## Notes

### Images
Be sure you have ImageMagick installed. This routine uses https://www.npmjs.com/package/gulp-image-resize to resize images.
How to install you can find here: https://www.npmjs.com/package/gulp-image-resize

### Video
Video processing is using videoprocess.sh for Linux, Mac and other and videoprocess.bat for Windows.  
Be sure if you have ffmpeg (http://ffmpeg.org/) and ffprobe installed.  
In case windows check if you have path to ffmpeg in your PATH variable and add system variable for presets. You can also uncomment first two lines in videoprocess.bat:  

```
SET PATH=%PATH%;d:\utils\ffmpeg\bin
SET FFMPEG_DATADIR=d:\utils\ffmpeg\presets
```

Don't forget to change the pathes.  
Feel free to change videoprocess.sh / videoprocess.bat as you need. As example, to remove audio you need to replace `-c:a aac -b:a 160k -async 1` with `-an`.  

## Known issues

1. imagemin-pngquant uses pngqunat-bin, and it contains old version of pngquant.exe. I created pull request to fix it: https://github.com/imagemin/pngquant-bin/pull/70
2. imagemin-pngquant doesn't have `--strip` option support. I created pull request to fix it: https://github.com/imagemin/imagemin-pngquant/pull/44

### Workaround
1. copy pngquant.exr from: https://pngquant.org/pngquant-windows.zip to node_modules/pngquant-bin/vendor
2. copy index.js from https://github.com/DKurilo/imagemin-pngquant/blob/master/index.js to node_modules/imagemin-pngquant/

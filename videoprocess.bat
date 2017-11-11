@echo off
SET PATH=d:\utils\ffmpeg\bin;%PATH%;
SET FFMPEG_DATADIR=d:\utils\ffmpeg\presets
ffmpeg -i %1 -nostats -loglevel 0 -me_method full -me_range 16 -partitions +partp8x8 -threads 2 -c:a aac -b:a 160k -async 1 -vsync 1 -vcodec libx264 -g 100 -sc_threshold 20 -bf 0 -b_strategy 2 -coder 1 -refs 8 -flags +loop -filter:v yadif -b:v 4096k -qmin 10 -qmax 51 -subq 9 -qdiff 1 -pass 1 -pix_fmt yuv420p -s %2 -movflags faststart -f mp4 -y nul
ffmpeg -i %1 -nostats -loglevel 0 -me_method full -me_range 16 -partitions +partp8x8 -threads 2 -c:a aac -b:a 160k -async 1 -vsync 1 -vcodec libx264 -g 100 -sc_threshold 20 -bf 0 -b_strategy 2 -coder 1 -refs 8 -flags +loop -filter:v yadif -b:v 4096k -qmin 10 -qmax 51 -subq 9 -qdiff 1 -pass 3 -pix_fmt yuv420p -s %2 -movflags faststart -f mp4 -y nul
ffmpeg -i %1 -nostats -loglevel 0 -me_method full -me_range 16 -partitions +partp8x8 -threads 2 -c:a aac -b:a 160k -async 1 -vsync 1 -vcodec libx264 -g 100 -sc_threshold 20 -bf 0 -b_strategy 2 -coder 1 -refs 8 -flags +loop -filter:v yadif -b:v 4096k -qmin 10 -qmax 51 -subq 9 -qdiff 1 -pass 2 -pix_fmt yuv420p -s %2 -movflags faststart -f mp4 -y %3

import React, {FC, useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';
import {Box} from '@material-ui/core';
import {PreparedVideo} from '../pages/StageOne';

type VideoValue = {
  label: string
  value: string
}

type VideoType = {
  label: string
  values: VideoValue[]
}

type VideoWrapperProps = {
  videos: VideoType[]
  supportWebm: boolean | null
  preparedVideos: PreparedVideo[]
  videoUrl: string
}

const VideoWrapper: FC<VideoWrapperProps> = ({videos, supportWebm, preparedVideos, videoUrl}) => {

  const [preparedVideo, setPreparedVideo] = useState<string>('');

  const timeRef = useRef(0);
  const player = useRef<ReactPlayer>(null);

  const [screen, setScreen] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    makeScreen();

    setPreparedVideo(videoUrl);
  }, [videoUrl]);

  const makeScreen = () => {

    if (player.current) {
      if (!player.current.getInternalPlayer()) {
        return;
      }

      const videoRef: HTMLVideoElement = player.current.getInternalPlayer() as HTMLVideoElement;

      const canvas = document.createElement('canvas');

      canvas.width = videoRef.offsetWidth;
      canvas.height = videoRef.offsetHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(player.current.getInternalPlayer() as HTMLVideoElement, 0, 0, canvas.width, canvas.height);

        const dataURI = canvas.toDataURL('image/jpeg');

        setScreen(dataURI);
      }
    }
  };

  const seekToCurrent = () => {
    if (player.current) {
      player.current.seekTo(timeRef.current, 'seconds');
    }
  };


  const handleReady = () => {
    if (player.current) {
      const htmlVideo = player.current.getInternalPlayer() as HTMLVideoElement;

      if (htmlVideo) {
        htmlVideo.addEventListener('loadedmetadata', () => {
          seekToCurrent();
        });
      }
    }
  };

  const handleSeek = () => {
    setPlaying(true);
  };

  const handlePlay = () => {
    setScreen(null);
  };

  // useEffect(() => {
  //   console.log('set');
  //
  // }, [player.current, playing, videoUrl]);

  return (
    <div style={{maxWidth: '960px', margin: '0 auto'}}>
      <Box mt={1} position="relative">
        <ReactPlayer
          width="100%"
          height="auto"
          ref={player}
          url={preparedVideo}
          muted={true}
          loop={true}
          playsinline={true}
          playing={playing}
          progressInterval={10}
          onReady={handleReady}
          onSeek={handleSeek}
          onPlay={handlePlay}
          onProgress={({playedSeconds}) => {
            if (playedSeconds > 0) {
              timeRef.current = playedSeconds;
            }
          }}
        />
        {screen && (
          <img alt="screen" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto'}}
            src={screen}/>
        )}
      </Box>
    </div>
  );
};

export default VideoWrapper;

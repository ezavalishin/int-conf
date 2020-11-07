import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import ReactPlayer from 'react-player';

const videos = [
  '/videos/new/kitchen_open_dark',
  '/videos/new/kitchen_closed_dark',
  '/videos/new/kitchen_open_light',
  '/videos/new/kitchen_closed_light',
];

const OneFilePlayer = () => {


  const player = useRef<ReactPlayer>(null);
  const [format, setFormat] = useState('mp4');

  const timeRef = useRef(0);

  const [screen, setScreen] = useState<string>('');

  const [type, setType] = useState('open');
  const [floor, setFloor] = useState('light');

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [windowIsReady, setWindowIsReady] = useState(false);

  useEffect(() => {
    const video = document.createElement('video');

    console.log(videos);

    const webmSupported = video.canPlayType('video/webm');

    let f = 'mp4';
    if (webmSupported !== '') {
      setFormat('webm');
      f = 'webm';
    } else {
      setWindowIsReady(true);
      return;
    }

    const promises = [];

    for(let i = 0; i < videos.length; i++) {
      const p = new Promise((resolve) => {
        const video = videos[i] + '.' + f;


        const req = new XMLHttpRequest();

        req.open('GET', video, true);

        req.addEventListener('load', () => {
          resolve(true);
        });

        req.send();
      });

      promises.push(p);
    }

    Promise.all(promises).then(() => {
      setPlaying(true);
      setWindowIsReady(true);
    });
  }, []);

  // const [currentTIme, setCurrentTime] = useState(0);

  const seekToCurrent = () => {
    if (player.current) {
      player.current.seekTo(timeRef.current, 'seconds');
    }
  };

  useEffect(() => {
    if (player.current) {
      console.log(player.current.getInternalPlayer());
      const htmlVideo = player.current.getInternalPlayer() as HTMLVideoElement;

      console.log('video', htmlVideo);

      if (htmlVideo) {
        htmlVideo.addEventListener('loadedmetadata', () => {
          console.log(timeRef.current);
          seekToCurrent();
        });

      }
    }
  }, [player.current, playing]);

  const makeScreen = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (player.current && ctx) {
      if (!player.current.getInternalPlayer()) {
        return;
      }
      ctx.drawImage(player.current.getInternalPlayer() as HTMLVideoElement, 0, 0, canvas.width, canvas.height);

      const dataURI = canvas.toDataURL('image/jpeg');

      setScreen(dataURI);
    }
  };


  const videoUrl = useMemo(() => {

    console.log(format, type, floor);


    makeScreen();


    setLoading(true);

    return `/videos/new/kitchen_${type}_${floor}.${format}`;
  }, [type, floor, format]);

  const handleReady = () => {
    setLoading(false);
  };


  return (
    <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center">

      <Box>
        <Box display="flex">
          <Box mx={1}>
            <FormControl>
              <InputLabel>
                  Тип
              </InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value as string)}>
                <MenuItem value="open">
                    Открытый
                </MenuItem>
                <MenuItem value="closed">
                    Закрытый
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mx={1}>
            <FormControl>
              <InputLabel>
                  Пол
              </InputLabel>
              <Select value={floor} onChange={(e) => setFloor(e.target.value as string)}>
                <MenuItem value="light">
                    Светлый
                </MenuItem>
                <MenuItem value="dark">
                    Темный
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box mt={1} position="relative">
          {!windowIsReady && 'loading'}
          <ReactPlayer
            onProgress={({playedSeconds}) => {
              if (playedSeconds > 0) {
                timeRef.current = playedSeconds;
              }
            }}
            progressInterval={10}
            ref={player}
            onReady={handleReady}
            muted={true}
            loop={true}
            playing={playing}
            url={videoUrl}
          />

          {(loading && screen.length > 0) && (
            <img alt="screen" width={640} height={360} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} src={screen}/>
          )}

        </Box>
      </Box>


    </Box>
  );
};

export default OneFilePlayer;

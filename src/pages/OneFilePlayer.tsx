import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import ReactPlayer from 'react-player';

const OneFilePlayer = () => {

  const player = useRef<ReactPlayer>(null);

  const timeRef = useRef(0);

  const [screen, setScreen] = useState<string>('');

  const [type, setType] = useState('open');
  const [floor, setFloor] = useState('light');

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // const [currentTIme, setCurrentTime] = useState(0);

  const seekToCurrent = () => {
    if (player.current) {
      player.current.seekTo(timeRef.current, 'seconds');
    }
  };

  useEffect(() => {
    if (player.current) {
      const htmlVideo = player.current.getInternalPlayer() as HTMLVideoElement;

      if (htmlVideo) {
        htmlVideo.addEventListener('loadedmetadata', () => {
          console.log(timeRef.current);
          seekToCurrent();
        });

      }
    }
  }, [player.current]);

  const makeScreen = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (player.current && ctx) {
      ctx.drawImage(player.current.getInternalPlayer() as HTMLVideoElement, 0, 0, canvas.width, canvas.height);

      const dataURI = canvas.toDataURL('image/jpeg');

      setScreen(dataURI);
    }
  };


  const videoUrl = useMemo(() => {

    makeScreen();

    setLoading(true);

    return `/videos/new/kitchen_${type}_${floor}.mp4`;
  }, [type, floor]);

  const handleReady = () => {
    setLoading(false);
    setPlaying(true);
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

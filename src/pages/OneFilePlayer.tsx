import React, {useMemo, useRef, useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import ReactPlayer from 'react-player';

const OneFilePlayer = () => {

  const player = useRef<ReactPlayer>(null);

  const [type, setType] = useState('open');
  const [floor, setFloor] = useState('light');

  const [playing, setPlaying] = useState(false);
  const [, setLoading] = useState(true);

  const [currentTIme, setCurrentTime] = useState(0);


  const videoUrl = useMemo(() => {
    setLoading(true);

    requestAnimationFrame(() => {
      seekToCurrent();
    });

    return `/videos/new/kitchen_${type}_${floor}.mp4`;
  }, [type, floor]);

  const handleReady = () => {
    setLoading(false);
    setPlaying(true);
  };

  const seekToCurrent = () => {
    if (player.current) {
      player.current.seekTo(currentTIme, 'seconds');
    }
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
        <Box mt={1}>
          <ReactPlayer onProgress={({playedSeconds}) => setCurrentTime(playedSeconds)} progressInterval={10} ref={player} onReady={handleReady} muted={true} loop={true} playing={playing} url={videoUrl}/>
        </Box>
      </Box>
    </Box>
  );
};

export default OneFilePlayer;

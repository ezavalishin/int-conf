import React, {useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player';

const data = [
  [
    'default_open.mp4',
    'default_closed.mp4'
  ],
  [
    'open_alpha_1.webm',
    'closed_alpha_1.webm',
  ]
];

function App() {
  const playerOne = useRef<ReactPlayer>(null);
  const playerTwo = useRef<ReactPlayer>(null);

  const [videoOne, setVideoOne] = useState(data[0][0]);
  const [videoTwo, setVideoTwo] = useState(data[1][0]);

  const [videoOneReady, setVideoOneReady] = useState(false);
  const [videoTwoReady, setVideoTwoReady] = useState(false);

  const [playing, setPlaying] = useState(false);

  const [currentSeek, setCurrentSeek] = useState(0);

  useEffect(() => {
    console.log('change');
    setPlaying(false);
    setVideoOneReady(false);
  }, [videoOne]);

  useEffect(() => {
    console.log('change');
    setPlaying(false);
    setVideoTwoReady(false);
  }, [videoTwo]);

  useEffect(() => {
    console.log('ready');
    if (videoOneReady && videoTwoReady) {
      seekTo(currentSeek);
      play();
    }

  }, [videoOneReady, videoTwoReady]);

  const seekTo = (seconds:number) => {
    if (playerOne.current && playerTwo.current) {
      playerOne.current.seekTo(seconds, 'seconds');
      playerTwo.current.seekTo(seconds, 'seconds');
    }
  };

  const restart = () => {
    seekTo(0);
    play();
  };

  const play = () => {
    requestAnimationFrame(() => {
      setPlaying(true);
    });
  };

  return (
    <div className="App">

      <div>
        <select onChange={(e) => {setVideoOne(e.target.value);}}>
          {data[0].map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <select onChange={(e) => {setVideoTwo(e.target.value);}}>
          {data[1].map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
      </div>

      <ReactPlayer onEnded={() => restart()} progressInterval={100} onProgress={({playedSeconds}) => setCurrentSeek(playedSeconds)}  ref={playerOne} onReady={() => setVideoOneReady(true)} muted={true} playing={playing} style={{position: 'absolute'}} url={`videos/${videoOne}`} />
      <ReactPlayer ref={playerTwo} onReady={() => setVideoTwoReady(true)} muted={true} playing={playing} style={{position: 'absolute'}} url={`videos/${videoTwo}`} />
    </div>
  );
}

export default App;

import React, {useEffect, useRef, useState} from 'react';
import MCorp from './lib/mediasync';

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

function AppNew() {

  const [srcOne, setSrcOne] = useState(data[0][0]);
  const [srcTwo, setSrcTwo] = useState(data[1][0]);

  const videoOne = useRef<HTMLVideoElement>(null);
  const videoTwo = useRef<HTMLVideoElement>(null);

  const to = useRef<any>(null);

  const pause = () => {
    if (to.current) {
      to.current.update({velocity:0.0});
    }
  };

  const play = () => {
    if (to.current) {
      to.current.update({velocity:1.0});
    }
  };

  const restart = () => {
    to.current.update({velocity:1.0, position: 0});
  };

  useEffect(() => {
    if (!to.current) {
      // @ts-ignore
      to.current = new window.TIMINGSRC.TimingObject({range:[0,100]});
    }

    MCorp.mediaSync(videoOne.current, to.current);
    MCorp.mediaSync(videoTwo.current, to.current);

    to.current.update({position:0.0, velocity: 1.0});
  }, []);

  return (
    <div className="App">

      <div>
        <button onClick={() => pause()}>pause</button>
        <button onClick={() => play()}>play</button>
        <select onChange={(e) => {setSrcOne(e.target.value);}}>
          {data[0].map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <select onChange={(e) => {setSrcTwo(e.target.value);}}>
          {data[1].map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
      </div>

      <video onEnded={() => restart()} style={{position: 'absolute'}} ref={videoOne} src={`/videos/${srcOne}`} muted={true} />
      <video onEnded={() => restart()} style={{position: 'absolute'}} ref={videoTwo} src={`/videos/${srcTwo}`} muted={true} />
    </div>
  );
}

export default AppNew;

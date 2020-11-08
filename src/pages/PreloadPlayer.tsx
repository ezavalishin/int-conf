import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Container, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import ReactPlayer from 'react-player';

// const videos = [
//   '/videos/new/kitchen_open_dark',
//   '/videos/new/kitchen_closed_dark',
//   '/videos/new/kitchen_open_light',
//   '/videos/new/kitchen_closed_light',
// ];

const videos = [
  {
    label: 'Тип',
    values: [
      {
        label: 'Открытый',
        value: 'open'
      },
      {
        label: 'Закрытый',
        value: 'closed'
      }
    ]
  },
  {
    label: 'Пол',
    values: [
      {
        label: 'Светлый',
        value: 'light'
      },
      {
        label: 'Темный',
        value: 'dark'
      }
    ]
  }
];

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
}

type PreparedVideo = {
  key: string
  value: string
}

const VideoWrapper: FC<VideoWrapperProps> = ({videos, supportWebm, preparedVideos}) => {

  const timeRef = useRef(0);
  const player = useRef<ReactPlayer>(null);

  const [screen, setScreen] = useState<string|null>(null);
  const [playing, setPlaying] = useState(true);
  const [set, setSet] = useState([
    videos[0].values[0].value,
    videos[1].values[0].value,
  ]);

  const updateSet = (key: number, value: string) => {
    setPlaying(false);
    requestAnimationFrame(() => {
      makeScreen();

      setSet((oldSet) => {
        const newSet = [...oldSet];
        newSet[key] = value;
        return newSet;
      });
    });
  };

  const videoUrl = useMemo(() => {
    const suffix = supportWebm ? '.webm' : '.mp4';
    return `kitchen_${set[0]}_${set[1]}${suffix}`;
  }, [set, supportWebm]);

  const makeScreen = () => {

    if (player.current) {
      if (!player.current.getInternalPlayer()) {
        return;
      }

      const videoRef:HTMLVideoElement = player.current.getInternalPlayer() as HTMLVideoElement;

      const canvas = document.createElement('canvas');

      console.log('video ref', videoRef, videoRef.width, videoRef.height);

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

  const preparedVideo = useMemo(() => {
    const found = preparedVideos.find((video) => {
      return video.key === videoUrl;
    });

    return found ? found.value : `/videos/new/${videoUrl}`;
  }, [videoUrl, preparedVideos]);

  const seekToCurrent = () => {
    if (player.current) {
      player.current.seekTo(timeRef.current, 'seconds');
    }
  };


  const handleReady = () => {
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
  };

  const handleSeek = () => {
    console.log('seek');
    setPlaying(true);
  };

  const handlePlay = () => {
    console.log('play');
    setScreen(null);
  };

  // useEffect(() => {
  //   console.log('set');
  //
  // }, [player.current, playing, videoUrl]);

  return (
    <div>
      <Box display="flex">
        {videos.map(((videType, key) => (
          <Box mx={1} key={videType.label}>
            <FormControl>
              <InputLabel>
                {videType.label}
              </InputLabel>
              <Select value={set[key]} onChange={(e) => updateSet(key, e.target.value as string)}>
                {videType.values.map((videoValue) => (
                  <MenuItem value={videoValue.value} key={videoValue.label}>
                    {videoValue.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )))}
      </Box>

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
          <img alt="screen" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto'}} src={screen}/>
        )}
      </Box>
    </div>
  );
};

const PreloadPlayer = () => {

  const [webmSupported, setWebmSupported] = useState<boolean | null>(null);
  const [videoFiles, setVideoFiles] = useState<string[] | null>(null);

  const [isReady, setIsReady] = useState(false);

  const [preparedVideos, setPreparedVideos] = useState<PreparedVideo[]>([]);

  useEffect(() => {
    const video = document.createElement('video');
    let sup = video.canPlayType('video/webm') != '';

    // remove webm
    sup = false;

    setWebmSupported(sup);

    // if (!sup) {
    //   setIsReady(true);
    //   return;
    // }

    const variants = videos.map((type) => {
      return type.values.map((value) => {
        return value.value;
      });
    });

    const videoFilesMap = [
      [variants[0][0], variants[1][0]],
      [variants[0][0], variants[1][1]],
      [variants[0][1], variants[1][0]],
      [variants[0][1], variants[1][1]],
    ];

    const videoFiles = videoFilesMap.map((arr) => {
      return 'kitchen_' + arr.join('_') + (sup ? '.webm' : '.mp4');
    });

    const promises = videoFiles.map((videoFile) => {
      return new Promise((resolve) => {
        const req = new XMLHttpRequest;
        req.open('GET', `/videos/new/${videoFile}`, true);
        req.responseType = 'blob';

        req.onload = function () {
          if (this.status === 200) {
            const vid = URL.createObjectURL(this.response);
            resolve({
              key: videoFile,
              value: vid
            } as PreparedVideo);
          }
        };

        req.send();
      });
    }) as Promise<PreparedVideo>[];

    Promise.all(promises).then((data) => {
      setIsReady(true);
      setPreparedVideos(data);
    });

  }, []);


  return (
    <Container>
      {isReady && <VideoWrapper videos={videos} supportWebm={webmSupported} preparedVideos={preparedVideos}/>}
      {!isReady && <div>loading</div>}
    </Container>
  );
};


export default PreloadPlayer;

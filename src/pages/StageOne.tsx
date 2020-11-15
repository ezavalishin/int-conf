import React, {FC, useEffect, useMemo, useState} from 'react';
import {VideoType} from './Demo';
import {getVideoUrl, VideoParams} from '../utils/videos';
import styled from 'styled-components';
import {Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select} from '@material-ui/core';
import VideoWrapper from '../components/VideoWrapper';

type StageProps = {
  videos: Array<VideoType>
  videoState: VideoParams
  updateSet: Function
  goNext?: Function
}

export type PreparedVideo = {
  key: number | string
  value: string
}

const Header = styled.div`
  display: flex;
`;

const StageOne: FC<StageProps> = ({videos, videoState, updateSet, goNext = null}) => {

  const [webmSupported, setWebmSupported] = useState<boolean | null>(null);

  const [isReady, setIsReady] = useState(false);

  const [preparedVideos, setPreparedVideos] = useState<PreparedVideo[]>([]);

  const [progress, setProgress] = useState<{ [key: string]: number; }>({});

  const totalProgress = useMemo(() => {
    const total = Object.values(progress).reduce((acc, val) => {
      return acc + val;
    }, 0) as number;

    return total / Object.keys(progress).length * 100;

  }, [progress]);

  useEffect(() => {
    const video = document.createElement('video');
    let sup = video.canPlayType('video/webm') != '';

    // remove webm
    // sup = false;

    setWebmSupported(sup);

    if (!sup) {
      setIsReady(true);
      return;
    }

    console.log(videos);

    const variants = videos.map((type) => {
      return type.values.map((value) => {
        return value.value;
      });
    });

    let videoFilesMap;
    let videoFiles: Array<VideoParams>;

    if (variants.length === 2) {
      videoFilesMap = [
        [variants[0][0], variants[1][0]],
        [variants[0][0], variants[1][1]],
        [variants[0][1], variants[1][0]],
        [variants[0][1], variants[1][1]],
      ];

      videoFiles = videoFilesMap.map((arr) => {
        return {
          type: arr[0],
          floor: arr[1],
          wall: videoState.wall
        } as VideoParams;
      });
    } else {

      console.log(variants);

      videoFilesMap = [
        variants[0][0],
        variants[0][1]
      ];

      console.log(videoFilesMap);

      videoFiles = videoFilesMap.map((arr) => {
        return {
          type: videoState.type,
          floor: videoState.floor,
          wall: arr
        } as VideoParams;
      });
    }

    const promises = videoFiles.map((videoFile, key) => {
      return new Promise((resolve) => {
        const req = new XMLHttpRequest;
        req.open('GET', getVideoUrl(videoFile), true);
        req.responseType = 'blob';

        req.onprogress = function (event) {
          setProgress((old) => {
            return {
              ...old,
              [key]: event.loaded / event.total
            };
          });
        };

        req.onload = function () {
          if (this.status === 200) {
            const vid = URL.createObjectURL(this.response);
            resolve({
              key: getVideoUrl(videoFile),
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

  const videoUrl = useMemo(() => {
    return getVideoUrl(videoState);
  }, [videoState]);

  const preparedVideo = useMemo(() => {
    const found = preparedVideos.find((video) => {
      return video.key === videoUrl;
    });

    return found ? found.value : videoUrl;
  }, [videoUrl, preparedVideos]);

  return (
    <div>
      <Header>
        {videos.map(((videType) => (
          <Box mx={1} key={videType.label}>
            <FormControl>
              <InputLabel>
                {videType.label}
              </InputLabel>
              <Select value={videoState[videType.name]}
                onChange={(e) => updateSet(videType.name, e.target.value as string)}>
                {videType.values.map((videoValue) => (
                  <MenuItem value={videoValue.value} key={videoValue.label}>
                    {videoValue.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )))}

        {goNext && (
          <Button color="primary" variant="contained" onClick={() => goNext()}>
            Далее
          </Button>
        )}

      </Header>

      <Box mt={5}>
        {!isReady && (
          <LinearProgress variant="determinate" value={totalProgress}/>
        )}

        {isReady && (
          <VideoWrapper
            videos={videos}
            supportWebm={false}
            preparedVideos={preparedVideos}
            videoUrl={preparedVideo}
          />
        )}

      </Box>

    </div>
  );
};

export default StageOne;

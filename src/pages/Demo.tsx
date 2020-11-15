import React, {FC, useState} from 'react';
import StageOne from './StageOne';
import StageTwo from './StageTwo';
import styled from 'styled-components';
import {getVideoUrl, TypeParams, VideoParams} from '../utils/videos';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';

type VideoValue = {
  label: string
  value: string
}

type TypeEnum = 'type' | 'floor' |  'wall';

export type VideoType = {
  name: TypeEnum
  label: string
  values: VideoValue[]
}

const Wrapper = styled.div`
  max-width: 960px;
  margin: 20px auto 0;
`;

const videos:Array<VideoType> = [
  {
    name: 'type',
    label: 'Grundriss',
    values: [
      {
        label: 'Ohne Abtrennung',
        value: 'open'
      },
      {
        label: 'Mit Abtrennung',
        value: 'close'
      }
    ]
  },
  {
    name: 'floor',
    label: 'Boden',
    values: [
      {
        label: 'Hell',
        value: 'light'
      },
      {
        label: 'Dunkel',
        value: 'dark'
      }
    ]
  },
  {
    name: 'wall',
    label: 'Wand- und Deckelbeläge',
    values: [
      {
        label: 'Hell ',
        value: 'light'
      },
      {
        label: 'Dunkel',
        value: 'dark'
      }
    ]
  }
];

const Demo: FC = () => {

  const [stage, setStage] = useState<'stageOne' | 'stageTwo'>('stageOne');

  const [videoState, setVideoState] = useState<VideoParams>({
    type: 'open',
    floor: 'light',
    wall: 'light'
  });

  const updateSet = (type:TypeEnum, value:string) => {
    setVideoState((old) => {
      return {
        ...old,
        [type]: value
      };
    });
  };

  const goNext = () => {
    setStage('stageTwo');
  };

  return (
    <div>
      <Wrapper>
        {stage === 'stageOne' && <StageOne videos={videos.slice(0, 2)} videoState={videoState} updateSet={updateSet} goNext={goNext}/>}
        {stage === 'stageTwo' && <StageOne videos={videos.slice(2, 3)} videoState={videoState} updateSet={updateSet}/>}
      </Wrapper>
    </div>
  );
};

export default Demo;

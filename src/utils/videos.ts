export type TypeParams = 'open' | 'close';
type FloorParams = 'light' | 'dark';
type WallParams = 'light' | 'dark';

export type VideoParams = {
  type?: TypeParams,
  floor?: FloorParams,
  wall?: WallParams
}

export function getVideoUrl(params: VideoParams = {
  type: 'open',
  floor: 'light',
  wall: 'light'
}, format = 'mp4') {
  const newParams: VideoParams = {
    type: 'open',
    floor: 'light',
    wall: 'light',
    ...params
  };

  return `/videos/new2/${newParams.type}_${newParams.floor}_${newParams.wall}.${format}`;
}

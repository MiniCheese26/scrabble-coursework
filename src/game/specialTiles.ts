import {EmptyGameGridItem} from '@Types/sharedTypes';

export const ThreeWordTile: EmptyGameGridItem = {
  backgroundColour: '#F00',
  textColour: '#FFF',
  topText: '3X',
  bottomText: 'WS',
  type: 'word',
  multiplier: 3,
  multiplierEnabled: true,
  empty: true,
};

export const TwoWordTile: EmptyGameGridItem = {
  backgroundColour: '#f700ff',
  textColour: '#000',
  topText: '2X',
  bottomText: 'WS',
  type: 'word',
  multiplier: 2,
  multiplierEnabled: true,
  empty: true,
};

export const ThreeLetterTile: EmptyGameGridItem = {
  backgroundColour: '#002aff',
  textColour: '#FFF',
  topText: '3X',
  bottomText: 'LS',
  type: 'letter',
  multiplier: 3,
  multiplierEnabled: true,
  empty: true,
};

export const TwoLetterTile: EmptyGameGridItem = {
  backgroundColour: '#00a6ff',
  textColour: '#000',
  topText: '2X',
  bottomText: 'LS',
  type: 'letter',
  multiplier: 2,
  multiplierEnabled: true,
  empty: true,
};

export const StartingTile: EmptyGameGridItem = {
  backgroundColour: '#f700ff',
  textColour: '#000',
  topText: 'Start',
  bottomText: '',
  type: 'word',
  multiplier: 2,
  multiplierEnabled: true,
  empty: true,
};

export const EmptyTile: EmptyGameGridItem = {
  backgroundColour: '#FFF',
  textColour: '',
  topText: '',
  bottomText: '',
  type: 'none',
  multiplier: 1,
  multiplierEnabled: true,
  empty: true,
};

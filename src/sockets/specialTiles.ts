import {GameGridIndexEmpty} from "../types/gamestate";

export const ThreeWordTile: GameGridIndexEmpty = {
  backgroundColour: '#F00',
  textColour: '#FFF',
  topText: '3X',
  bottomText: 'WS',
  type: 'word',
  multiplier: 3,
  multiplierClaimant: '',
  empty: true,
};

export const TwoWordTile: GameGridIndexEmpty = {
  backgroundColour: '#f700ff',
  textColour: '#000',
  topText: '2X',
  bottomText: 'WS',
  type: 'word',
  multiplier: 2,
  multiplierClaimant: '',
  empty: true,
};

export const ThreeLetterTile: GameGridIndexEmpty = {
  backgroundColour: '#002aff',
  textColour: '#FFF',
  topText: '3X',
  bottomText: 'LS',
  type: 'letter',
  multiplier: 3,
  multiplierClaimant: '',
  empty: true,
};

export const TwoLetterTile: GameGridIndexEmpty = {
  backgroundColour: '#00a6ff',
  textColour: '#000',
  topText: '2X',
  bottomText: 'LS',
  type: 'letter',
  multiplier: 2,
  multiplierClaimant: '',
  empty: true,
};

export const StartingTile: GameGridIndexEmpty = {
  backgroundColour: '#f700ff',
  textColour: '#000',
  topText: 'Start',
  bottomText: '',
  type: 'word',
  multiplier: 2,
  multiplierClaimant: '',
  empty: true,
};

export const EmptyTile: GameGridIndexEmpty = {
  backgroundColour: '#FFF',
  textColour: '',
  topText: '',
  bottomText: '',
  type: 'none',
  multiplier: 1,
  multiplierClaimant: '',
  empty: true,
};
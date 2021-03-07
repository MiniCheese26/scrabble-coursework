export type GamePlayerType = 'Human' | 'Ai' | 'Ignore' | 'Empty';

export interface LocalPlayer {
  name: string;
  type: GamePlayerType;
  id: string;
}

export interface Letter {
  letter: string;
  value: number
}

export interface PlaceLetterArgs {
  targetIndex: number;
  newData: Letter;
}

export interface GameSocketIdentification {
  gameId: string;
  socketId: string;
}

export interface Coordinate {
  x: number,
  y: number
}

export interface RemoveBoardLetterArgs {
  index: number
}

export interface ExchangeLettersArgs {
  letters: Letter[]
}

export type GameType = 'local' | 'online' | '';

export interface SharedPlayer {
  playerId: string,
  type: GamePlayerType,
  letters: LetterWithCount[],
  score: number,
  name: string
}

export interface LetterWithCount extends Letter {
  count: number
}

export type SpecialTileType = 'letter' | 'word' | 'none';

export interface EmptyGameGridItem {
  textColour: string,
  backgroundColour: string,
  topText: string,
  bottomText: string,
  type: SpecialTileType,
  multiplier: number,
  multiplierEnabled: boolean,
  empty: true
}

export interface FilledGameGridItem extends Letter {
  empty: false,
  playerId: string
  orderIndex: number,
  turnIndex: number
}

export type GameGridItem = EmptyGameGridItem | FilledGameGridItem;

export interface GameGridElement<T extends GameGridItem> {
  gridItem: T,
  index: number
}

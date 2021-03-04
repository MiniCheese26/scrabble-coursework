import {Letter as SharedLetter} from "../../sharedTypes/sharedTypes";
import {GameState} from "../sockets/gameState";

export type SpecialTileType = 'letter' | 'word' | 'none';

export type EmptyGameGridItem = {
  textColour: string,
  backgroundColour: string,
  topText: string,
  bottomText: string,
  type: SpecialTileType,
  multiplier: number,
  multiplierClaimant: string,
  empty: true
};

export type FilledGameGridItem = {
  empty: false,
  playerId: string
  orderIndex: number,
  turnIndex: number
} & SharedLetter;

export type GameGridItem = EmptyGameGridItem | FilledGameGridItem;

export type GameGridElement = {
  gridItem: GameGridItem,
  index: number
};

export type GameGridLayout = {
  [x: number]: GameGridElement
};

export type BagLetter = {
  count: number
} & SharedLetter;

export type ParsedGameGrid = {
  columns: Lines,
  rows: Lines
};

export type Lines = {
  [key: number]: GameGridElement[]
};

export type GameStates = {
  [roomId: string]: GameState
};

export type SpecialCoordinates = {
  [y: number]: {
    [x: number]: EmptyGameGridItem
  }
};

export type WordScore = {
  playerId: string,
  score: number
};
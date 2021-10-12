import {EmptyGameGridItem, Letter, GameGridElement, GameGridItem} from '@Types/sharedTypes';

export type GameGridLayout<T extends GameGridItem> = {
  [x: number]: GameGridElement<T>
};

export type BagLetter = {
  count: number
} & Letter;

export type ParsedGameGrid = {
  columns: Lines,
  rows: Lines
};

export type Lines = {
  [key: number]: GameGridElement<GameGridItem>[]
};

export type SpecialCoordinates = {
  [y: number]: {
    [x: number]: EmptyGameGridItem
  }
};

import {EmptyGameGridItem, Letter, GameGridElement, GameGridItem} from "../../sharedTypes/sharedTypes";
import {GameState} from "../sockets/gameState";

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

export type GameStates = {
  [roomId: string]: GameState
};

export type SpecialCoordinates = {
  [y: number]: {
    [x: number]: EmptyGameGridItem
  }
};
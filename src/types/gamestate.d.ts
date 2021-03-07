import {EmptyGameGridItem, Letter, GameGridElement} from "../../sharedTypes/sharedTypes";
import {GameState} from "../sockets/gameState";

export type GameGridLayout = {
  [x: number]: GameGridElement
};

export type BagLetter = {
  count: number
} & Letter;

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
import {ThreeWordTile, TwoLetterTile, TwoWordTile, ThreeLetterTile, StartingTile} from "./specialTiles";
import {EmptyGameGridItem, SpecialCoordinates} from "../types/gamestate";

export const SPECIAL_COORDINATES: SpecialCoordinates = {
  0: {
    0: ThreeWordTile,
    3: TwoLetterTile,
    7: ThreeWordTile,
  },
  1: {
    1: TwoWordTile,
    5: ThreeLetterTile,
  },
  2: {
    2: TwoWordTile,
    6: TwoLetterTile,
  },
  3: {
    0: TwoLetterTile,
    3: TwoWordTile,
    7: TwoLetterTile,
  },
  4: {
    4: TwoWordTile,
  },
  5: {
    1: ThreeLetterTile,
    5: ThreeLetterTile,
  },
  6: {
    2: TwoLetterTile,
    6: TwoLetterTile,
  },
  7: {
    0: ThreeWordTile,
    3: TwoLetterTile,
    7: StartingTile,
  },
};
import {Coordinate} from "../../sharedTypes/sharedTypes";
import {GameGridElement, GameGridItem} from "../types/gamestate";
import fetch from "node-fetch";

const DICTIONARY_URL = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/';

export const wordCache: string[] = [];

export class GameStateHelpers {
  static indexToXY(index: number): Coordinate {
    const y = Math.floor(index / 15);
    const x = index - (y * 15);

    return {
      x,
      y,
    };
  }

  static XYToIndex(coordinate: Coordinate) {
    return coordinate.y * 15 + coordinate.x;
  }

  static getSurroundingCoordinatesAsArray(index: number): Coordinate[] {
    const {x, y} = GameStateHelpers.indexToXY(index);

    return [
      {x: x + 1, y},
      {x: x - 1, y},
      {x, y: y - 1},
      {x: x + 1, y: y - 1},
      {x: x - 1, y: y - 1},
      {x, y: y + 1},
      {x: x + 1, y: y + 1},
      {x: x - 1, y: y + 1},
    ];
  }

  static isEmpty(gridItem: GameGridItem) {
    if (gridItem.empty) {
      return gridItem;
    }

    return null;
  }

  static isNotEmpty(gridItem: GameGridItem) {
    if (gridItem.empty === false) {
      return gridItem;
    }

    return null;
  }

  static getLineWords(line: GameGridElement[]) {
    const words: GameGridElement[][] = [];

    let currentWord = [];

    for (const letter of line) {
      if (letter.gridItem.empty) {
        words.push(currentWord);
        currentWord = [];
      } else {
        currentWord.push(letter);
      }
    }

    if (currentWord.length > 0) {
      words.push(currentWord);
    }

    return words;
  }

  static async checkWord(word: string) {
    if (wordCache.includes(word)) {
      return true;
    }

    return (await fetch(DICTIONARY_URL + word)).ok;
  }
}
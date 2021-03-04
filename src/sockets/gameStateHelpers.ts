import {Coordinate} from "../../sharedTypes/sharedTypes";
import {GameGridElement, GameStateGridIndex, SurroundingIndexes} from "../types/gamestate";
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

  static getSurroundingIndexes(index: number): SurroundingIndexes {
    return {
      right: index + 1,
      left: index - 1,
      top: index - 15,
      topRight: index - 14,
      topLeft: index - 16,
      bottom: index + 15,
      bottomRight: index + 16,
      bottomLeft: index + 14
    };
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

  static isEmpty(d: GameStateGridIndex) {
    if (d.empty) {
      return d;
    }

    return null;
  }

  static isNotEmpty(d: GameStateGridIndex) {
    if (d.empty === false) {
      return d;
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
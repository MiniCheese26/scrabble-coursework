import {
  Coordinate,
  EmptyGameGridItem,
  FilledGameGridItem,
  GameGridElement,
  GameGridItem
} from "../../sharedTypes/sharedTypes";
import fetch from "node-fetch";

const DICTIONARY_URL = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/';

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

  static castGridItem<T extends EmptyGameGridItem | FilledGameGridItem>(gridElement: GameGridElement<GameGridItem>): GameGridElement<T> {
    return {...gridElement, gridItem: gridElement.gridItem as T};
  }

  static getLineWords(line: GameGridElement<GameGridItem>[]) {
    const words: GameGridElement<FilledGameGridItem>[][] = [];

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
    return (await fetch(DICTIONARY_URL + word)).ok;
  }
}
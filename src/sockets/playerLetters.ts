import {Letter as SharedLetter} from "../../sharedTypes/sharedTypes";
import {BagLetter} from "../types/gamestate";

export class PlayerLetters {
  private _letters: BagLetter[];

  get letters(): BagLetter[] {
    return this._letters;
  }

  constructor() {
    this._letters = [];
  }

  private _sortLetters() {
    this._letters.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      } else if (a.value > b.value) {
        return 1;
      }

      if (a.letter < b.letter) {
        return -1;
      } else if (a.letter > b.letter) {
        return 1;
      }

      return 0;
    });
  }

  getTotal() {
    return this._letters.length === 0
      ? 0
      : this._letters.map(x => x.count).reduce((a, b) => a + b);
  }

  addLetter(letter: SharedLetter) {
    if (this.getTotal() === 7) {
      return false;
    }

    const existingLetter = this._letters.find(x => x === letter);

    if (existingLetter) {
      existingLetter.count++;
      return true;
    }

    this._letters.push({
      letter: letter.letter,
      value: letter.value,
      count: 1,
    });

    this._sortLetters();
  }

  addLetters(letters: SharedLetter[]) {
    for (const letter of letters) {
      this.addLetter(letter);
    }
  }

  hasLetter(letter: string, value: number) {
    return this._letters.filter(x => x.letter === letter && x.value === value).length > 0;
  }

  hasLetterInstance(letter: SharedLetter) {
    return this._letters.filter(x => x === letter).length > 0;
  }

  removeLetter(letter: SharedLetter) {
    const targetLetter = this._letters.find(x => x.letter === letter.letter);

    if (targetLetter) {
      if (targetLetter.count === 1) {
        this._letters = this._letters.filter(x => x !== targetLetter);
      } else {
        targetLetter.count--;
      }
    }

    this._sortLetters();
  }
}
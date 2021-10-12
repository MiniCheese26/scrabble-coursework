import {Letter} from '@Types/sharedTypes';
import {BagLetter} from '@Types/gamestate';

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
    return this._letters.reduce((a, b) => a + b.count, 0);
  }

  addLetter(letter: Letter) {
    if (this.getTotal() === 7) {
      return;
    }

    const existingLetter = this._letters.find(x => x === letter);

    if (existingLetter) {
      existingLetter.count++;
      return;
    }

    this._letters.push({
      letter: letter.letter,
      value: letter.value,
      count: 1,
    });

    this._sortLetters();
  }

  addLetters(letters: Letter[]) {
    for (const letter of letters) {
      this.addLetter(letter);
    }
  }

  hasLetter(letter: string, value: number) {
    return this._letters.some(x => x.letter === letter && x.value === value);
  }

  hasLetterWhere(predicate: (letter: Letter) => boolean) {
    return this._letters.some(predicate);
  }

  removeLetter(letter: Letter) {
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

  removeLetterWhere(predicate: (letter: Letter) => boolean) {
    const targetLetter = this._letters.find(predicate);

    if (targetLetter) {
      this.removeLetter(targetLetter);
    }
  }
}

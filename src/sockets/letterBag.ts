import {GameLetters, Letter} from "./gameLetters";
import {Letter as SharedLetter} from "../../sharedTypes/sharedTypes";

export class LetterBag {
  private readonly _letters: Letter[];

  constructor() {
    this._letters = [...GameLetters];
  }

  private _getTotal() {
    return this._letters.reduce((a, b) => a + b.count, 0);
  }

  getRandomLetter(): SharedLetter | null {
    const availableLetters = this._letters.filter(x => x.count > 0);

    if (availableLetters.length === 0) {
      return null;
    }

    const allLetters: Letter[] = [];

    for (const letter of this._letters) {
      for (let i = 0; i < letter.count; i++) {
        allLetters.push(letter);
      }
    }

    let randomIndex = Math.floor(Math.random() * this._getTotal() - 1);

    // random index would sometimes be -1
    if (randomIndex < 0) {
      randomIndex = 0;
    }

    const randomLetter = allLetters[randomIndex];
    randomLetter.count--;

    return {
      letter: randomLetter.letter,
      value: randomLetter.value,
    };
  }

  getRandomLetters(number: number): SharedLetter[] {
    const letters: SharedLetter[] = [];

    for (let i = 0; i < number; i++) {
      const randomLetter = this.getRandomLetter();

      if (randomLetter) {
        letters.push(randomLetter);
      }
    }

    return letters;
  }

  addLetter(letter: string) {
    const letterToAdd = this._letters.find(x => x.letter === letter);
    const indexOfLetterToAdd = this._letters.indexOf(letterToAdd);

    this._letters[indexOfLetterToAdd].count++;
  }
}
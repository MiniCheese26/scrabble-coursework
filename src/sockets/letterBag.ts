import {
  Letter,
  LetterA,
  LetterB, LetterBlank,
  LetterC,
  LetterD,
  LetterE,
  LetterF,
  LetterG,
  LetterH,
  LetterI,
  LetterJ,
  LetterK,
  LetterL,
  LetterM,
  LetterN,
  LetterO,
  LetterP,
  LetterQ,
  LetterR,
  LetterS,
  LetterT,
  LetterU,
  LetterV,
  LetterW, LetterX, LetterY, LetterZ
} from "./gameLetters";
import {Letter as SharedLetter} from "../../sharedTypes/sharedTypes";

export class LetterBag {
  private readonly _letters: Letter[];

  constructor() {
    this._letters = [
      new LetterA(),
      new LetterB(),
      new LetterC(),
      new LetterD(),
      new LetterE(),
      new LetterF(),
      new LetterG(),
      new LetterH(),
      new LetterI(),
      new LetterJ(),
      new LetterK(),
      new LetterL(),
      new LetterM(),
      new LetterN(),
      new LetterO(),
      new LetterP(),
      new LetterQ(),
      new LetterR(),
      new LetterS(),
      new LetterT(),
      new LetterU(),
      new LetterV(),
      new LetterW(),
      new LetterX(),
      new LetterY(),
      new LetterZ(),
      new LetterBlank(),
    ];
  }

  private _getTotal() {
    return this._letters.map(x => x.count).reduce((a, b) => a + b, 0);
  }

  getRandomLetter(): SharedLetter | null {
    const availableLetters = this._letters.filter(x => x.count > 0);

    if (availableLetters.length === 0) {
      return null;
    }

    const allLetters: Letter[] = [];

    for (let letter of this._letters) {
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
    const d = this._letters.find(x => x.letter === letter);
    const l = this._letters.indexOf(d);

    this._letters[l].count++;
  }
}
import {GameLetters, GameStateLetter} from './gameStateLetters';
import {Letter} from '@Types/sharedTypes';

export class LetterBag {
  private readonly _letters: GameStateLetter[];

  constructor() {
    this._letters = [...GameLetters];
  }

  getRandomLetter(): Letter | null {
    const availableLetters = this._letters.filter(x => x.count > 0);

    if (availableLetters.length === 0) {
      return null;
    }

    const allLetters: GameStateLetter[] = [];

    for (const letter of availableLetters) {
      for (let i = 0; i < letter.count; i++) {
        allLetters.push(letter);
      }
    }

    let randomIndex = Math.floor(Math.random() * allLetters.length - 1);

    // random index would sometimes be -1
    if (randomIndex < 0) {
      randomIndex = 0;
    }

    const randomLetter = allLetters[randomIndex];
    randomLetter.count--;

    return {
      letter: randomLetter.letter,
      value: randomLetter.value
    };
  }

  getRandomLetters(number: number): Letter[] {
    const letters: Letter[] = [];

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

    if (letterToAdd) {
      const indexOfLetterToAdd = this._letters.indexOf(letterToAdd);

      this._letters[indexOfLetterToAdd].count++;
    }
  }

  hasLettersLeft() {
    return this._letters.reduce((a, b) => a + b.count, 0) > 0;
  }
}

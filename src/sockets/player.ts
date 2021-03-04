import {GameStatePlayerType, LocalPlayer} from "../../sharedTypes/sharedTypes";
import {PlayerLetters} from "./playerLetters";
import {BagLetter, GameGridIndexFilled} from "../types/gamestate";
import {LetterBag} from "./letterBag";

export class Player {
  playerId: string;
  type: GameStatePlayerType;
  letters: PlayerLetters;
  score: number;
  placedTiles: GameGridIndexFilled[];
  name: string;

  constructor(player: LocalPlayer) {
    this.playerId = player.id;
    this.type = player.type;
    this.name = player.name;
    this.score = 0;
    this.letters = new PlayerLetters();
    this.placedTiles = [];
  }

  static initialise(player: LocalPlayer, letterBag: LetterBag) {
    const gameStatePlayer = new Player(player);

    gameStatePlayer.letters.addLetters(letterBag.getRandomLetters(7));

    return gameStatePlayer;
  }

  playerHasLetterInstance(letter: BagLetter) {
    return this.letters.hasLetterInstance(letter);
  }

  playerHasLetter(letter: string, value: number) {
    return this.letters.hasLetter(letter, value);
  }

  getJsonString() {
    return JSON.stringify({
      playerId: this.playerId,
      type: this.type,
      letters: this.letters.letters,
      score: this.score,
      name: this.name,
    });
  }

  getJsonObject() {
    return {
      playerId: this.playerId,
      type: this.type,
      letters: this.letters.letters,
      score: this.score,
      name: this.name,
    }
  }
}
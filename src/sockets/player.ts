import {GamePlayerType, LocalPlayer} from "../../sharedTypes/sharedTypes";
import {PlayerLetters} from "./playerLetters";
import {FilledGameGridItem} from "../types/gamestate";
import {LetterBag} from "./letterBag";

export class Player {
  playerId: string;
  type: GamePlayerType;
  letters: PlayerLetters;
  score: number;
  placedTiles: FilledGameGridItem[];
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
    const newPlayer = new Player(player);

    newPlayer.letters.addLetters(letterBag.getRandomLetters(7));

    return newPlayer;
  }

  playerHasLetter(letter: string, value: number) {
    return this.letters.hasLetter(letter, value);
  }

  getJsonString() {
    return JSON.stringify(this.getJsonObject());
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
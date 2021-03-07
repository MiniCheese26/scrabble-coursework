import {FilledGameGridItem, GamePlayerType, LocalPlayer, SharedPlayer} from "../../sharedTypes/sharedTypes";
import {PlayerLetters} from "./playerLetters";
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

  getJsonString() {
    return JSON.stringify(this.getJsonObject());
  }

  getJsonObject(): SharedPlayer {
    return {
      playerId: this.playerId,
      type: this.type,
      letters: this.letters.letters,
      score: this.score,
      name: this.name,
    };
  }
}
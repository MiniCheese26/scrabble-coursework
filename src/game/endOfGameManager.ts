import {Player} from './player';

export class EndOfGameManager {
  allLettersUsed?: boolean;
  hasEnded?: boolean;
  playerAtStartOfLoop?: Player;
  lettersPlacedAtStartOfLastLoop?: number;

  checkIfEnded(playerId: string, lettersPlaced: number) {
    if (playerId === this.playerAtStartOfLoop?.playerId) {
      if (lettersPlaced === this.lettersPlacedAtStartOfLastLoop) {
        this.hasEnded = true;
      } else {
        this.lettersPlacedAtStartOfLastLoop = lettersPlaced;
      }
    }
  }
}

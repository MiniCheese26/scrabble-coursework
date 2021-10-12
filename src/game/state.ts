import {Player} from './player';
import {GameGridElement, GameGridItem, SharedPlayerLimited} from '@Types/sharedTypes';

export class State {
  grid: GameGridElement<GameGridItem>[];
  players: Player[];
  currentPlayer: string;
  allLettersUsed: boolean;
  gameOver: boolean;

  constructor(grid: GameGridElement<GameGridItem>[], players: Player[], currentPlayer: string, allLettersUsed: boolean, gameOver: boolean) {
    this.grid = grid;
    this.players = players;
    this.currentPlayer = currentPlayer;
    this.allLettersUsed = allLettersUsed;
    this.gameOver = gameOver;
  }

  getPlayer(id: string) {
    return this.players.find(x => x.playerId === id);
  }

  getPlayersJson() {
    return JSON.stringify(this.players.map(x => x.getJsonObject()));
  }

  getPlayersOnline(playerId: string) {
    return this.players.map(x => {
      if (x.playerId === playerId) {
        return x.getJsonObject();
      } else {
        return {
          score: x.score,
          name: x.name,
          playerId: x.playerId
        } as SharedPlayerLimited;
      }
    });
  }
}

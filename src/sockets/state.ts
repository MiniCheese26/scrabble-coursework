import {Player} from "./player";

export class State {
  grid: string;
  players: Player[];
  currentPlayer: string;

  constructor(grid: string, players: Player[], currentPlayer: string) {
    this.grid = grid;
    this.players = players;
    this.currentPlayer = currentPlayer;
  }

  getPlayer(id: string) {
    return this.players.find(x => x.playerId === id);
  }

  getPlayersJson() {
    return JSON.stringify(this.players.map(x => x.getJsonObject()));
  }
}
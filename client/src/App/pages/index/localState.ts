import {GameGridElement, GameGridItem, LobbyData, SocketIdentification} from 'Types/sharedTypes';
import {GameData, IndexStates} from 'Types/types';

export class LocalState {
  grid: GameGridElement<GameGridItem>[];
  gameData: GameData;
  activeErrors: string[];
  hasNotAnnouncedOutOfLetters: boolean;
  gameIsOver: boolean;
  currentPlayer: string;

  lobbyData: LobbyData;

  id: SocketIdentification;
  loadingState: IndexStates;

  constructor() {
    this.grid = [];
    this.id = {
      roomId: '',
      playerId: '',
      socketId: sessionStorage.getItem('socketId') ?? ''
    };
    this.gameData = {
      CurrentGame: {
        active: false,
        type: ''
      },
      Players: []
    };
    this.lobbyData = {
      lobbyId: '',
      players: [],
    };
    this.loadingState = 'notLoading';
    this.activeErrors = [];
    this.hasNotAnnouncedOutOfLetters = true;
    this.gameIsOver = false;
    this.currentPlayer = '';
  }
}

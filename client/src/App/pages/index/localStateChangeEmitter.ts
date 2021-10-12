import {
  EndTurnResponseArgs,
  GameCreatedResponseArgs,
  GridStateUpdatedResponseArgs,
  LobbyDataUpdatedResponseArgs,
  LobbyStatusResponseArgs,
  OnlineLobbyJoinedResponseArgs,
  PlayerLeftResponseArgs,
  PlayersUpdatedResponseArgs,
  PlayerUpdatedResponseArgs,
  ReconnectedAckResponseArgs,
  SyncGameStateResponseArgs
} from 'Types/responseArgs';
import React, {MutableRefObject} from 'react';
import {EventEmitter} from 'events';
import {LocalState} from 'Pages/index/localState';
import {SharedPlayer, SharedPlayerLimited} from 'Types/sharedTypes';

export default class LocalStateChangeEmitter {
  gridUpdated: EventEmitter;
  lobbyJoined: EventEmitter;
  lobbyDataUpdated: EventEmitter;
  gameDataUpdated: EventEmitter;
  loadingStateUpdated: EventEmitter;
  activeErrorsUpdated: EventEmitter;
  gameIsOverUpdated: EventEmitter;
  socketIsConnectedUpdated: EventEmitter;
  shouldReconnectUpdated: EventEmitter;
  idUpdated: EventEmitter;
  lobbyStatusReceived: EventEmitter;
  joinedLobby: EventEmitter;
  kicked: EventEmitter;
  onlineGameStarted: EventEmitter;
  currentPlayerIdUpdated: EventEmitter;
  turnEnded: EventEmitter;
  private readonly socket: MutableRefObject<WebSocket | undefined>;
  private readonly setShouldReSync: React.Dispatch<React.SetStateAction<boolean>>;
  private localState: MutableRefObject<LocalState>;

  constructor(
    setShouldReSync: React.Dispatch<React.SetStateAction<boolean>>,
    socket: MutableRefObject<WebSocket | undefined>,
    localState: MutableRefObject<LocalState>) {
    this.socket = socket;
    this.setShouldReSync = setShouldReSync;
    this.localState = localState;
    this.gridUpdated = new EventEmitter();
    this.lobbyJoined = new EventEmitter();
    this.gameDataUpdated = new EventEmitter();
    this.loadingStateUpdated = new EventEmitter();
    this.activeErrorsUpdated = new EventEmitter();
    this.gameIsOverUpdated = new EventEmitter();
    this.socketIsConnectedUpdated = new EventEmitter();
    this.shouldReconnectUpdated = new EventEmitter();
    this.idUpdated = new EventEmitter();
    this.lobbyStatusReceived = new EventEmitter();
    this.joinedLobby = new EventEmitter();
    this.lobbyDataUpdated = new EventEmitter();
    this.kicked = new EventEmitter();
    this.onlineGameStarted = new EventEmitter();
    this.currentPlayerIdUpdated = new EventEmitter();
    this.turnEnded = new EventEmitter();
  }

  onOnlineLobbyJoined(argumentsParsed: OnlineLobbyJoinedResponseArgs) {
    this.localState.current.id.playerId = argumentsParsed.playerId;

    this.idUpdated.emit('update', this.localState.current.id);
    this.lobbyJoined.emit('update', argumentsParsed);
  }

  onLobbyDataUpdated(argumentsParsed: LobbyDataUpdatedResponseArgs) {
    this.localState.current.lobbyData = argumentsParsed.lobbyData;
    this.localState.current.id.roomId = argumentsParsed.lobbyData.lobbyId;

    this.idUpdated.emit('update', this.localState.current.id);
    this.lobbyDataUpdated.emit('update', this.localState.current.lobbyData);
  }

  onOnlineGameCreated(argumentsParsed: GameCreatedResponseArgs) {
    this.localState.current.lobbyData = {
      players: [],
      lobbyId: '',
    };

    this.localState.current.grid = argumentsParsed.grid;
    this.localState.current.id.roomId = argumentsParsed.gameId;
    this.localState.current.gameData.CurrentGame = {
      active: true,
      type: 'online'
    };
    this.localState.current.gameData.Players = argumentsParsed.players;
    this.localState.current.loadingState = 'notLoading';
    this.localState.current.currentPlayer = argumentsParsed.currentPlayer;

    this.idUpdated.emit('update', this.localState.current.id);
    this.currentPlayerIdUpdated.emit('update', this.localState.current.currentPlayer);
    this.gameDataUpdated.emit('update', this.localState.current.gameData);
    this.gridUpdated.emit('update', this.localState.current.grid);
    this.loadingStateUpdated.emit('update', this.localState.current.loadingState);
    this.onlineGameStarted.emit('update', true);
  }

  onLocalGameCreated(argumentsParsed: GameCreatedResponseArgs) {
    this.localState.current.grid = argumentsParsed.grid;
    this.localState.current.id = {
      roomId: argumentsParsed.gameId,
      playerId: '0',
      socketId: sessionStorage.getItem('socketId') ?? ''
    };
    this.localState.current.gameData.CurrentGame = {
      active: true,
      type: 'local',
    };
    this.localState.current.gameData.Players = argumentsParsed.players;
    this.localState.current.loadingState = 'notLoading';
    this.localState.current.currentPlayer = argumentsParsed.currentPlayer;

    this.idUpdated.emit('update', this.localState.current.id);
    this.currentPlayerIdUpdated.emit('update', this.localState.current.currentPlayer);
    this.gameDataUpdated.emit('update', this.localState.current.gameData);
    this.gridUpdated.emit('update', this.localState.current.grid);
    this.loadingStateUpdated.emit('update', this.localState.current.loadingState);
  }

  onGridStateUpdated(argumentsParsed: GridStateUpdatedResponseArgs) {
    this.localState.current.grid = argumentsParsed.grid;
    this.gridUpdated.emit('update', this.localState.current.grid);
  }

  onPlayerUpdated(argumentsParsed: PlayerUpdatedResponseArgs) {
    this._updatePlayer(argumentsParsed.player);

    this.gameDataUpdated.emit('update', this.localState.current.gameData);
  }

  onPlayersUpdated(argumentsParsed: PlayersUpdatedResponseArgs) {
    for (const player of argumentsParsed.players) {
      this._updatePlayer(player);
    }

    this.gameDataUpdated.emit('update', this.localState.current.gameData);
  }

  onEndTurn(argumentsParsed: EndTurnResponseArgs) {
    if (argumentsParsed.gameType === 'local') {
      this.localState.current.id.playerId = argumentsParsed.currentPlayer;
      this.idUpdated.emit('update', this.localState.current.id);
    }

    this.localState.current.currentPlayer = argumentsParsed.currentPlayer;
    this.localState.current.activeErrors = argumentsParsed.errors;

    this.currentPlayerIdUpdated.emit('update', this.localState.current.currentPlayer);
    this.activeErrorsUpdated.emit('update', this.localState.current.activeErrors);
  }

  onGameCanEnd() {
    if (this.localState.current.hasNotAnnouncedOutOfLetters) {
      this.localState.current.hasNotAnnouncedOutOfLetters = false;
      alert('You are now out of new letters, the game will end when no more words can be made');
    }
  }

  onGameEnded() {
    this.localState.current.gameIsOver = true;

    this.gameIsOverUpdated.emit('update', this.localState.current.gameIsOver);
  }

  onReconnectedAck(argumentsParsed: ReconnectedAckResponseArgs) {
    console.log(`reconnection ACK - ${String(argumentsParsed.success)}`);

    if (!argumentsParsed.success) {
      if (this.localState.current.gameData.CurrentGame.active) {
        this.socket.current?.close();
      }
    } else {
      this.setShouldReSync(true);
    }
  }

  onSyncGameState(argumentsParsed: SyncGameStateResponseArgs) {
    this.localState.current.grid = argumentsParsed.grid;
    this.localState.current.gameData.Players = argumentsParsed.players;

    if (this.localState.current.gameData.CurrentGame.type === 'local') {
      this.localState.current.id.playerId = argumentsParsed.currentPlayer;
      this.idUpdated.emit('update', this.localState.current.id);
    }

    this.localState.current.currentPlayer = argumentsParsed.currentPlayer;

    if (argumentsParsed.allLettersUsed) {
      this.onGameEnded();
    } else if (argumentsParsed.gameOver) {
      this.onGameEnded();
    }


    this.idUpdated.emit('update', this.localState.current.id);
    this.currentPlayerIdUpdated.emit('update', this.localState.current.currentPlayer);
    this.gameDataUpdated.emit('update', this.localState.current.gameData);
    this.gridUpdated.emit('update', this.localState.current.grid);
  }

  onSyncLobbyState(argumentsParsed: LobbyDataUpdatedResponseArgs) {
    this.localState.current.lobbyData = argumentsParsed.lobbyData;

    this.lobbyDataUpdated.emit('update', this.localState.current.lobbyData);
  }

  onKicked() {
    this.localState.current.id.playerId = '';

    this.idUpdated.emit('update', this.localState.current.id);
    this.kicked.emit('update', true);
  }

  onPlayerLeft(argumentsParsed: PlayerLeftResponseArgs) {
    alert(`Player ${argumentsParsed.playerName} left`);
  }

  onLobbyStatus(argumentsParsed: LobbyStatusResponseArgs) {
    this.lobbyStatusReceived.emit('update', argumentsParsed);
  }

  private _updatePlayer(parsedData: (SharedPlayer | SharedPlayerLimited)) {
    const targetPlayerIndex = this.localState.current.gameData.Players.findIndex(x => x.playerId === parsedData.playerId);

    if (targetPlayerIndex !== -1) {
      this.localState.current.gameData.Players[targetPlayerIndex] = parsedData;
    }
  }
}

import {ExchangeLettersArgs, IWebsocketRequestMethod,} from 'Types/sharedTypes';
import {MutableRefObject} from 'react';
import {LocalState} from 'Pages/index/localState';
import {EventEmitter} from 'events';
import {
  CheckLobbyStatusArgs,
  CreateLocalGameArgs,
  CreateOnlineLobbyArgs,
  JoinOnlineLobbyArgs,
  LeaveOnlineLobbyArgs,
  PlaceLetterArgs,
  RemoveBoardLetterArgs,
  RemovePlayerLettersArgs,
  UpdateLobbyNameArgs
} from 'Types/requestArgs';

export default class SocketOperations {
  private readonly socket?: MutableRefObject<WebSocket | undefined>;
  private readonly localState: MutableRefObject<LocalState>;
  private readonly isConnected: EventEmitter;

  constructor(localState: MutableRefObject<LocalState>, socket?: MutableRefObject<WebSocket | undefined>) {
    this.socket = socket;
    this.localState = localState;
    this.isConnected = new EventEmitter();
  }

  send<T>(data: IWebsocketRequestMethod<T>) {
    data.arguments = {...data.arguments, ...{id: this.localState.current.id}};

    if (this.socket?.current) {
      if (this.socket.current?.readyState !== WebSocket.OPEN) {
        const onOpen = () => this.isConnected.emit('connected');

        this.socket.current?.addEventListener('open', onOpen);

        (async () => {
          console.log('awaiting connection');
          await new Promise((resolve, reject) => {
            this.isConnected.once('connected', () => {
              this.socket?.current?.removeEventListener('open', onOpen);
              resolve(0);
            });

            setTimeout(() => {
              console.log('aborting waiting for connecting');
              this.socket?.current?.removeEventListener('open', onOpen);
              reject();
            }, 15000);
          });
        })().catch(() => {
          return;
        });
      }

      if (this.socket.current?.readyState === WebSocket.OPEN) {
        this.socket.current.send(JSON.stringify(data));
      }
    }
  }

  syncGameState() {
    this.send({
      method: 'syncGameState',
      arguments: {}
    });
  }

  leaveLobby(args: LeaveOnlineLobbyArgs) {
    this.send({
      method: 'leaveOnlineLobby',
      arguments: args
    });
  }

  kickFromLobby(args: LeaveOnlineLobbyArgs) {
    this.send({
      method: 'kickLobbyPlayer',
      arguments: args
    });
  }

  setLobbyName(args: UpdateLobbyNameArgs) {
    this.send({
      method: 'updateLobbyName',
      arguments: args
    });
  }

  checkLobby(args: CheckLobbyStatusArgs) {
    this.send({
      method: 'checkLobbyStatus',
      arguments: args
    });
  }

  createLocalGame(args: CreateLocalGameArgs) {
    this.send({
      method: 'createLocalGame',
      arguments: args
    });
  }

  createOnlineGame() {
    this.send({
      method: 'createOnlineGame',
      arguments: {}
    });
  }

  placeLetter(args: PlaceLetterArgs) {
    this.send({
      method: 'placeLetter',
      arguments: args
    });
  }

  removeBoardLetter(args: RemoveBoardLetterArgs) {
    this.send({
      method: 'removeBoardLetter',
      arguments: args
    });
  }

  removePlayerLetters(args: RemovePlayerLettersArgs) {
    this.send({
      method: 'removePlayerLetters',
      arguments: args
    });
  }

  endTurn() {
    this.send({
      method: 'endTurn',
      arguments: {}
    });
  }

  exchangeLetters(args: ExchangeLettersArgs) {
    (async () => {
      const response = await fetch('/gameState/canExchange', {
        method: 'post',
        body: JSON.stringify(this.localState.current.id),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async x => await x.json() as { canExchange: boolean });
      return response.canExchange;
    })().then((canExchange) => {
      if (canExchange) {
        this.removePlayerLetters({letters: args.letters});
        this.endTurn();
      }
    }).catch(() => {
      return;
    });
  }

  leaveGame() {
    this.send({
      method: 'leaveGame',
      arguments: {}
    });
  }

  createOnlineLobby(args: CreateOnlineLobbyArgs) {
    this.send({
      method: 'createOnlineLobby',
      arguments: args
    });
  }

  joinOnlineLobby(args: JoinOnlineLobbyArgs) {
    this.send({
      method: 'joinOnlineLobby',
      arguments: args
    });
  }
}

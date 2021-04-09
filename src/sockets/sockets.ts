import {
  GameSocketIdentification,
  PlaceLetterArgs,
  RemoveBoardLetterArgs,
  WebsocketMethods, RemovePlayerLettersArgs, SocketArgs, EndTurnArgs, CreateLocalGameArgs,
} from 'SharedTypes/sharedTypes';
import {nanoid} from 'nanoid';
import {
  GameStates
} from "../types/gamestate";
import {GameState} from "./gameState";
import {Server} from "ws"
import WebSocket = require("ws");

const gameStates: GameStates = {};

class WebsocketMethod {
  private readonly _websocketMethod: IWebsocketMethod;

  constructor(method: WebsocketMethods, args: object) {
    this._websocketMethod = {
      method,
      arguments: args
    };
  }

  getJsonString() {
    return JSON.stringify(this._websocketMethod);
  }
}

interface IWebsocketMethod {
  method: WebsocketMethods,
  arguments: object
}

type PlaceLetterArguments = {
  id: GameSocketIdentification
} & PlaceLetterArgs;

class WebsocketRoomConnection {
  public connection: WebSocket;
  public socketId: string;
}

class WebsocketRoom {
  private _connections: WebsocketRoomConnection[];
  private readonly _roomId: string;

  get roomId(): string {
    return this._roomId;
  }

  get connections(): WebsocketRoomConnection[] {
    return this._connections;
  }

  constructor(roomId: string) {
    this._roomId = roomId;
    this._connections = [];
  }

  join(connection: WebsocketRoomConnection) {
    this._connections.push(connection);
  }

  leave(socketId: string) {
    this._connections = this._connections.filter(x => x.socketId !== socketId);
  }

  emitToRoom(method: WebsocketMethods, args?: object) {
    const r = new WebsocketMethod(method, args ?? {}).getJsonString();

    for (const connection of this._connections) {
      connection.connection.send(r);
    }
  }
}

class WebsocketRooms {
  private _rooms: WebsocketRoom[];

  constructor() {
    this._rooms = [];
  }

  createRoom(connection: WebsocketRoomConnection, roomId: string) {
    const newRoom = new WebsocketRoom(roomId);
    newRoom.join(connection);
    this._rooms.push(newRoom);
  }

  deleteRoom(roomId: string) {
    this._rooms = this._rooms.filter(x => x.roomId !== roomId);
  }

  getRoom(roomId: string): WebsocketRoom | undefined {
    return this._rooms.find(x => x.roomId === roomId);
  }
}

const rooms = new WebsocketRooms();

function defineWebsocketMethod<T extends object>(message: IWebsocketMethod, method: WebsocketMethods, cb: (args: T) => void) {
  if (message.method === method) {
    const messageArguments = message.arguments as T;

    cb(messageArguments);
  }
}

export function initialiseSocket(ws: Server) {
  ws.on("connection", (connection) => {
    connection.on("message", (message) => {
      if (typeof message === "string") {
        const messageParsed: IWebsocketMethod = JSON.parse(message);

        defineWebsocketMethod<CreateLocalGameArgs>(messageParsed, "createLocalGame", (args) => {
          const gameId = nanoid(8);

          const newGameState = GameState.initialise(args.localPlayers);

          gameStates[gameId] = newGameState;

          const state = newGameState.syncState();

          rooms.createRoom({
            connection: connection,
            socketId: args.id.socketId
          }, gameId);

          const response = new WebsocketMethod("localGameCreated", {
            grid: state.grid,
            gameId,
            players: [...state.players.map(x => x.getJsonObject())],
            currentPlayer: state.currentPlayer
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<PlaceLetterArguments>(messageParsed, "placeLetter", (args) => {
          const gameState = gameStates[args.id.gameId];

          const state = gameState.placeLetter(args.targetIndex, args.id.socketId, args.newData, args.oldIndex).syncState();

          const gameRoom = rooms.getRoom(args.id.gameId);

          gameRoom.emitToRoom("gridStateUpdated", {grid: state.grid});

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<RemoveBoardLetterArgs>(messageParsed, "removeBoardLetter", (args) => {
          const gameState = gameStates[args.id.gameId];

          const state = gameState.removeBoardLetter(args.index, args.id.socketId, args.isBeingMoved).syncState();

          const gameRoom = rooms.getRoom(args.id.gameId);

          gameRoom.emitToRoom("gridStateUpdated", {grid: state.grid});

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<RemovePlayerLettersArgs>(messageParsed, "removePlayerLetters", (args) => {
          const gameState = gameStates[args.id.gameId];

          const state = gameState.removePlayerLetters(args.id.socketId, ...args.letters).syncState();

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<SocketArgs>(messageParsed, "givePlayerLetters", (args) => {
          const gameState = gameStates[args.id.gameId];

          const state = gameState.givePlayerLetters(args.id.socketId).syncState();

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<EndTurnArgs>(messageParsed, "endTurn", (args) => {
          (async () => {
            const gameState = gameStates[args.id.gameId];

            const errors = await gameState.processTurn();

            const state = gameState.syncState();

            const gameRoom = rooms.getRoom(args.id.gameId);

            gameRoom.emitToRoom("gridStateUpdated", {
              grid: state.grid
            })

            if (args.type === 'local') {
              const response = new WebsocketMethod("updatePlayers", {
                players: [...state.players.map(x => x.getJsonObject())]
              }).getJsonString();

              connection.send(response);
            } else if (args.type === 'online') {
              for (const roomConnection of gameRoom.connections) {
                const response = new WebsocketMethod("updatePlayers", {
                  player: state.getPlayer(roomConnection.socketId).getJsonObject()
                }).getJsonString();

                roomConnection.connection.send(response);
              }
            }

            gameRoom.emitToRoom("endTurn", {
              currentPlayer: state.currentPlayer,
              errors: errors
            });

            if (state.gameOver) {
              gameRoom.emitToRoom("gameEnded");
            }
            else if (state.allLettersUsed) {
              gameRoom.emitToRoom("gameCanEnd");
            }
          })();
        });
      }
    });
  })
}

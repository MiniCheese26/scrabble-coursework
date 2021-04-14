import {
  GameSocketIdentification,
  PlaceLetterArgs,
  RemoveBoardLetterArgs,
  WebsocketMethods, RemovePlayerLettersArgs, SocketArgs, SocketGameTypeArgs, CreateLocalGameArgs,
} from 'SharedTypes/sharedTypes';
import {nanoid} from 'nanoid';
import {GameState} from "./gameState";
import {Server} from "ws"
import WebSocket = require("ws");
import * as express from "express";

declare global {
  interface WebSocket {
    id: string;
  }
}

class GameStates {
  public states: { [roomId: string]: GameState };

  constructor() {
    this.states = {};
  }

  deleteGameState(gameState: GameState) {
    this.states[gameState.gameId] = null;
  }
}

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
  private readonly _gameId: string;

  get roomId(): string {
    return this._roomId;
  }

  get connections(): WebsocketRoomConnection[] {
    return this._connections;
  }

  get gameId(): string {
    return this._gameId;
  }

  constructor(roomId: string, gameId: string) {
    this._roomId = roomId;
    this._gameId = gameId;
    this._connections = [];
  }

  join(connection: WebsocketRoomConnection) {
    this._connections.push(connection);
  }

  leave(socketId: string) {
    this._connections = this._connections.filter(x => x.socketId !== socketId);
  }

  emitToRoom(method: WebsocketMethods, args?: object) {
    const websocketMethod = new WebsocketMethod(method, args ?? {}).getJsonString();

    for (const connection of this._connections) {
      connection.connection.send(websocketMethod);
    }
  }

  hasSocketId(socketId: string) {
    return this.connections.some(x => x.socketId === socketId);
  }

  getWebsocketConnectionByConnection(connection: WebSocket): WebsocketRoomConnection | undefined {
    return this.connections.find(x => x.connection === connection);
  }

  getWebsocketConnectionBySocketId(socketId: string): WebsocketRoomConnection | undefined {
    return this.connections.find(x => x.socketId === socketId);
  }
}

class WebsocketRooms {
  private _rooms: WebsocketRoom[];

  constructor() {
    this._rooms = [];
  }

  createRoom(connection: WebsocketRoomConnection, roomId: string, gameId: string) {
    const newRoom = new WebsocketRoom(roomId, gameId);
    newRoom.join(connection);
    this._rooms.push(newRoom);
  }

  deleteRoom(roomId: string) {
    this._rooms = this._rooms.filter(x => x.roomId !== roomId);
  }

  getRoom(roomId: string): WebsocketRoom | undefined {
    return this._rooms.find(x => x.roomId === roomId);
  }

  getRoomByConnection(connection: WebSocket): WebsocketRoom | undefined {
    return this._rooms.find(x => x.getWebsocketConnectionByConnection(connection) !== undefined);
  }
}

const rooms = new WebsocketRooms();

function defineWebsocketMethod<T extends SocketArgs>(message: IWebsocketMethod, method: WebsocketMethods, cb: (args: T) => void) {
  if (message.method === method) {
    const messageArguments = message.arguments as T;

    cb(messageArguments);
  }
}

const gameStates = new GameStates();

let socketsLost: WebSocket[] = [];

export function initialiseSocket(ws: Server) {
  ws.on("connection", (connection) => {
    connection.on("message", (message) => {
      if (typeof message === "string") {
        const messageParsed: IWebsocketMethod = JSON.parse(message);

        defineWebsocketMethod<CreateLocalGameArgs>(messageParsed, "createLocalGame", (args) => {
          const gameId = nanoid(8);

          const newGameState = GameState.initialise(args.localPlayers, gameId);

          gameStates.states[gameId] = newGameState;

          rooms.createRoom({
            connection: connection,
            socketId: args.id.socketId
          }, gameId, gameId);

          const state = newGameState.syncState();

          const response = new WebsocketMethod("localGameCreated", {
            grid: state.grid,
            gameId,
            players: [...state.players.map(x => x.getJsonObject())],
            currentPlayer: state.currentPlayer
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<PlaceLetterArguments>(messageParsed, "placeLetter", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const state = gameState.placeLetter(args.targetIndex, args.id.socketId, args.newData, args.oldIndex).syncState();

          const gameRoom = rooms.getRoom(args.id.gameId);

          gameRoom.emitToRoom("gridStateUpdated", {grid: state.grid});

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<RemoveBoardLetterArgs>(messageParsed, "removeBoardLetter", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const state = gameState.removeBoardLetter(args.index, args.id.socketId, args.isBeingMoved).syncState();

          const gameRoom = rooms.getRoom(args.id.gameId);

          gameRoom.emitToRoom("gridStateUpdated", {grid: state.grid});

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<RemovePlayerLettersArgs>(messageParsed, "removePlayerLetters", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const state = gameState.removePlayerLetters(args.id.socketId, ...args.letters).syncState();

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod(messageParsed, "givePlayerLetters", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const state = gameState.givePlayerLetters(args.id.socketId).syncState();

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId).getJsonObject()
          }).getJsonString();

          connection.send(response);
        });

        defineWebsocketMethod<SocketGameTypeArgs>(messageParsed, "endTurn", (args) => {
          (async () => {
            const gameState = gameStates.states[args.id.gameId];

            const errors = await gameState.processTurn();

            const state = gameState.syncState();

            const gameRoom = rooms.getRoom(args.id.gameId);

            gameRoom.emitToRoom("gridStateUpdated", {
              grid: state.grid
            });

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
              gameStates.deleteGameState(gameState);
              rooms.deleteRoom(args.id.gameId);
            } else if (state.allLettersUsed) {
              gameRoom.emitToRoom("gameCanEnd");
            }
          })();
        });

        defineWebsocketMethod(messageParsed, "reconnected", (args) => {
          const room = rooms.getRoom(args.id.gameId);

          if (room) {
            const oldConnection = room.getWebsocketConnectionBySocketId(args.id.socketId);

            if (room.hasSocketId(args.id.socketId)) {
              room.leave(args.id.socketId);
              room.join({
                connection,
                socketId: args.id.socketId
              });

              socketsLost = socketsLost.filter(x => x !== oldConnection.connection);

              const response = new WebsocketMethod("reconnectedAck", {
                success: true
              }).getJsonString();

              connection.send(response);
            }
          } else {
            const response = new WebsocketMethod("reconnectedAck", {
              success: false
            }).getJsonString();

            connection.send(response);
          }
        });

        defineWebsocketMethod<SocketGameTypeArgs>(messageParsed, "syncState", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const state = gameState.syncState();

          if (args.type === "local") {
            const response = new WebsocketMethod("syncState", {
              grid: state.grid,
              gameOver: state.gameOver,
              allLettersUsed: state.allLettersUsed,
              players: [...state.players.map(x => x.getJsonObject())],
              currentPlayer: state.currentPlayer
            }).getJsonString();

            connection.send(response);
          } else {
            const response = new WebsocketMethod("syncState", {
              grid: state.grid,
              gameOver: state.gameOver,
              allLettersUsed: state.allLettersUsed,
              players: [...state.players.map(x => x.getJsonObject())],
              currentPlayer: state.currentPlayer
            }).getJsonString();

            connection.send(response);
          }
        });

        defineWebsocketMethod(messageParsed, "leaveGame", (args) => {
          const gameState = gameStates.states[args.id.gameId];

          const o = gameState.getPlayer(args.id.socketId);

          gameState.kickPlayer(args.id.socketId);
          const r = rooms.getRoomByConnection(connection);
          r.leave(args.id.socketId);

          if (r.connections.length === 0) {
            gameStates.deleteGameState(gameState);
            rooms.deleteRoom(r.roomId);
          } else {
            r.emitToRoom("playerLeft", {
              playerName: o.name
            });

            const state = gameState.syncState();

            //TODO the if online or local thing
            r.emitToRoom("syncState", {
              grid: state.grid,
              gameOver: state.gameOver,
              allLettersUsed: state.allLettersUsed,
              players: [...state.players.map(x => x.getJsonObject())],
              currentPlayer: state.currentPlayer
            });
          }
        });
      }
    });
    connection.on("close", (code) => {
      //console.log("code", code);
      //console.log("reason", reason);

      if (code === 1001 || code === 1006 || code === 1005) {
        console.log("pushing connection");
        socketsLost.push(connection);
        setTimeout(() => {
          console.log("running");
          if (socketsLost.includes(connection)) {
            console.log("includes");
            const l = rooms.getRoomByConnection(connection);

            if (l !== undefined) {
              const c = l.getWebsocketConnectionByConnection(connection);
              l.leave(c.socketId);
              const g = gameStates.states[l.gameId];
              // might need shallow clone
              const p = g.getPlayer(c.socketId);
              g.kickPlayer(c.socketId);

              if (l.connections.length === 0) {
                gameStates.deleteGameState(g);
                rooms.deleteRoom(l.roomId);
              } else {
                l.emitToRoom("playerLeft", {
                  playerName: p.name
                });

                const state = g.syncState();

                //TODO the if online or local thing
                l.emitToRoom("syncState", {
                  grid: state.grid,
                  gameOver: state.gameOver,
                  allLettersUsed: state.allLettersUsed,
                  players: [...state.players.map(x => x.getJsonObject())],
                  currentPlayer: state.currentPlayer
                });
              }

              connection.terminate();
            }
          }
          console.log("no includes");
        }, 30000);
      }
    });
  });
}

export const gameStateRouter = express.Router();

gameStateRouter.post("/canExchange", (req, res) => {
  const body = req.body as GameSocketIdentification;

  const gameState = gameStates.states[body.gameId];

  if (gameState) {
    const sync = gameState.syncState();

    return res.json({
      canExchange: sync.allLettersUsed || true
    });
  }

  return res.sendStatus(500).end();
});

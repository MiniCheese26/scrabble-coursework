import {Server, Socket} from 'socket.io';
import {
  GameSocketIdentification,
  LocalPlayer,
  PlaceLetterArgs,
  Letter,
  RemoveBoardLetterArgs,
  GameType,
} from 'SharedTypes/sharedTypes';
import {nanoid} from 'nanoid';
import {
  GameStates
} from "../types/gamestate";
import {GameState} from "./gameState";
import {connection, server} from "websocket"

const gameStates: GameStates = {};

type WebsocketMethods = "createLocalGame" | "placeLetter" | "localGameCreated" | "gridStateUpdated" | "updatePlayer";

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

type CreateLocalGameArguments = {
  localPlayers: LocalPlayer[]
};

type PlaceLetterArguments = {
  id: GameSocketIdentification
} & PlaceLetterArgs;

class WebsocketRoom {
  private _players: connection[];
  private readonly _roomId: string;

  get roomId(): string {
    return this._roomId;
  }

  get players(): connection[] {
    return this._players;
  }

  constructor(roomId: string) {
    this._roomId = roomId;
    this._players = [];
  }

  join(connection: connection) {
    this._players.push(connection);
  }

  leave(connection: connection) {
    this._players = this._players.filter(x => x !== connection);
  }

  emitToRoom(method: WebsocketMethods, args: object) {
    const r = new WebsocketMethod(method, args).getJsonString();

    for (const player of this._players) {
      player.sendUTF(r);
    }
  }
}

class WebsocketRooms {
  private _rooms: WebsocketRoom[];

  constructor() {
    this._rooms = [];
  }

  createRoom(connection: connection, roomId: string) {
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

function defineWebsocketMethod<T extends object>(message: IWebsocketMethod, method: WebsocketMethods, cb: (argumentss: T) => void) {
  if (message.method === method) {
    const messageArguments = message.arguments as T;

    cb(messageArguments);
  }
}

export function initialiseSockett(ws: server) {
  ws.on("request", (req) => {
    const connection = req.accept("echo-protocol");

    connection.on("message", (msg) => {
      if (msg.type === "utf8") {
        const messageParsed: IWebsocketMethod = JSON.parse(msg.utf8Data);

        defineWebsocketMethod<CreateLocalGameArguments>(messageParsed, "createLocalGame", (args) => {
          const gameId = nanoid(8);

          const newGameState = GameState.initialise(args.localPlayers);

          gameStates[gameId] = newGameState;

          const state = newGameState.syncState();

          rooms.createRoom(connection, gameId);

          const response = new WebsocketMethod("localGameCreated", {
            grid: state.grid,
            gameId,
            players: state.getPlayersJson(),
            currentPlayer: state.currentPlayer
          }).getJsonString();

          connection.sendUTF(response);
        });

        defineWebsocketMethod<PlaceLetterArguments>(messageParsed, "placeLetter", (args) => {
          const gameState = gameStates[args.id.gameId];

          const state = gameState.placeLetter(args.targetIndex, args.id.socketId, args.newData).syncState();

          const gameRoom = rooms.getRoom(args.id.gameId);

          gameRoom.emitToRoom("gridStateUpdated", {grid: state.grid});

          const response = new WebsocketMethod("updatePlayer", {
            player: state.getPlayer(args.id.socketId)
          }).getJsonString();

          connection.sendUTF(response);
        });
      }
    });
  });
}

export default function initialiseSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('createLocalGame', (args: LocalPlayer[]) => {
      (async () => {
        const gameId = nanoid(8);

        const newGameState = GameState.initialise(args);

        gameStates[gameId] = newGameState;

        const state = newGameState.syncState();

        await socket.join(gameId);
        socket.emit('localGameCreated', state.grid, gameId, state.getPlayersJson(), state.currentPlayer);
      })()
        .catch((a: never) => {
          console.log(a);
        });
    });

    socket.on('placeLetter', (id: GameSocketIdentification, args: PlaceLetterArgs) => {
      const gameState = gameStates[id.gameId];

      const state = gameState.placeLetter(args.targetIndex, id.socketId, args.newData).syncState();

      io.to(id.gameId).emit('gridStateUpdated', state.grid);
      socket.emit('updatePlayer', state.getPlayer(id.socketId).getJsonString());
    });

    socket.on('removeBoardLetter', (id: GameSocketIdentification, args: RemoveBoardLetterArgs) => {
      const gameState = gameStates[id.gameId];

      const state = gameState.removeBoardLetter(args.index, id.socketId).syncState();

      io.to(id.gameId).emit('gridStateUpdated', state.grid);
      socket.emit('updatePlayer', state.getPlayer(id.socketId).getJsonString());
    });

    socket.on("removePlayerLetters", (id: GameSocketIdentification, args: Letter[]) => {
      const gameState = gameStates[id.gameId];

      const state = gameState.removePlayerLetters(id.socketId, ...args).syncState();

      socket.emit('updatePlayer', state.getPlayer(id.socketId).getJsonString());
    });

    socket.on("givePlayerLetters", (id: GameSocketIdentification) => {
      const gameState = gameStates[id.gameId];

      const state = gameState.givePlayerLetters(id.socketId).syncState();

      socket.emit('updatePlayer', state.getPlayer(id.socketId).getJsonString());
    });

    socket.on('endTurn', (id: GameSocketIdentification, type: GameType) => {
      (async () => {
        const gameState = gameStates[id.gameId];

        const errors = await gameState.processTurn();

        const state = gameState.syncState();

        io.to(id.gameId).emit('gridStateUpdated', state.grid, state.currentPlayer);

        if (type === 'local') {
          socket.emit('updatePlayers', state.getPlayersJson());
        } else if (type === 'online') {
          const roomClients = io.sockets.adapter.rooms.get(id.gameId);

          for (const roomClient of roomClients) {
            const clientSocket = io.sockets.sockets.get(roomClient);

            clientSocket.emit('updatePlayer', state.getPlayer(roomClient).getJsonString());
          }
        }

        io.to(id.gameId).emit('endTurn', state.currentPlayer, JSON.stringify(errors));
      })().catch((a: never) => console.log(a));
    });

    socket.on('sync', (id: GameSocketIdentification) => {
      const gameState = gameStates[id.gameId];

      const state = gameState.syncState();

      socket.emit('sync', state.grid, state.getPlayersJson(), state.currentPlayer);
    });

    socket.on('endGame', (id: GameSocketIdentification) => {
      console.log(id);
    });
  });
}

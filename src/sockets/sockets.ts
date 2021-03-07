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

const gameStates: GameStates = {};

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

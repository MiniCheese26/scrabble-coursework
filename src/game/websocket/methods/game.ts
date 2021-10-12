import {nanoid} from 'nanoid';
import {GameState} from '@Game/gameState';
import {rooms} from '../sockets';
import WebSocket from 'ws';
import {WebsocketMethod} from '../websocketMethod';
import {idNotPresentResponse, isNotCurrentPlayer, verifyOnlinePlayer} from './utils';
import {WebsocketRoom} from '../websocketRoom';
import {Player} from '@Game/player';
import {
  EndTurnResponseArgs,
  GameCreatedResponseArgs,
  GridStateUpdatedResponseArgs,
  PlayerLeftResponseArgs,
  PlayersUpdatedResponseArgs,
  PlayerUpdatedResponseArgs,
  SyncGameStateResponseArgs
} from '@Types/responseArgs';
import {
  CreateLocalGameArgs,
  PlaceLetterArgs,
  RemoveBoardLetterArgs,
  RemovePlayerLettersArgs,
  SocketArgs
} from '@Types/requestArgs';

export function createOnlineGame(args: SocketArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('onlineGameCreated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && room.roomData.public && room.roomData.private && room.roomData.private.host === args.id.socketId) {
    const gameId = nanoid(8);

    const newGameState = GameState.initialise(room.roomData.public.players, gameId, 'online');

    if (!newGameState) {
      room.emitToRoom<GameCreatedResponseArgs>('onlineGameCreated', {
        error: {
          message: 'Failed to initialise new game state'
        }
      });
      return;
    }

    const gameRoom = rooms.createGameRoom({
      connection: connection,
      socketId: args.id.socketId,
      playerId: args.id.playerId
    }, gameId, newGameState);

    // don't connect host twice
    for (const connection of room.connections.filter(x => x.socketId !== args.id?.socketId)) {
      gameRoom.join(connection);
    }

    rooms.deleteRoom(args.id.roomId);

    const state = newGameState.syncState();

    for (const connection of gameRoom.connections) {
      const response = new WebsocketMethod<GameCreatedResponseArgs>('onlineGameCreated', {
        data: {
          grid: state.grid,
          gameId,
          players: [...state.getPlayersOnline(connection.playerId)],
          currentPlayer: state.currentPlayer
        }
      }).getJsonString();

      connection.connection.send(response);
    }
  }
}

export function createLocalGame(args: CreateLocalGameArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('localGameCreated'));
    return;
  }

  const gameId = nanoid(8);

  const newGameState = GameState.initialise(args.localPlayers, gameId, 'local');

  if (!newGameState) {
    const response = new WebsocketMethod('localGameCreated', {
      error: {
        message: 'Failed to initialise new game state'
      }
    }).getJsonString();

    connection.send(response);
    return;
  }

  rooms.createGameRoom({
    connection: connection,
    socketId: args.id.socketId,
    playerId: args.id.playerId
  }, gameId, newGameState);

  const state = newGameState.syncState();

  const response = new WebsocketMethod<GameCreatedResponseArgs>('localGameCreated', {
    data: {
      grid: state.grid,
      gameId,
      players: [...state.players.map(x => x.getJsonObject())],
      currentPlayer: state.currentPlayer
    }
  }).getJsonString();

  connection.send(response);
}

export function placeLetter(args: PlaceLetterArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('playerUpdated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    if (isNotCurrentPlayer(gameState, room, args.id)) {
      return;
    }

    const state = gameState.placeLetter(args.targetIndex, args.id.playerId, args.newData, args.oldIndex).syncState();

    room.emitToRoom<GridStateUpdatedResponseArgs>('gridStateUpdated', {data: {grid: state.grid}});

    const response = new WebsocketMethod<PlayerUpdatedResponseArgs>('playerUpdated', {
      data: {player: state.getPlayer(args.id.playerId)!.getJsonObject()}
    }).getJsonString();

    connection.send(response);
  }
}

export function removeBoardLetter(args: RemoveBoardLetterArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('playerUpdated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    if (isNotCurrentPlayer(gameState, room, args.id)) {
      return;
    }

    const state = gameState.removeBoardLetter(args.index, args.id.playerId, args.isBeingMoved).syncState();

    room.emitToRoom<GridStateUpdatedResponseArgs>('gridStateUpdated', {data: {grid: state.grid}});

    const response = new WebsocketMethod<PlayerUpdatedResponseArgs>('playerUpdated', {
      data: {
        player: state.getPlayer(args.id.playerId)!.getJsonObject()
      }
    }).getJsonString();

    connection.send(response);
  }
}

export function removePlayerLetters(args: RemovePlayerLettersArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('playerUpdated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    if (isNotCurrentPlayer(gameState, room, args.id)) {
      return;
    }

    const state = gameState.removePlayerLetters(args.id.playerId, ...args.letters).syncState();

    const response = new WebsocketMethod('playerUpdated', {
      data: {
        player: state.getPlayer(args.id.playerId)!.getJsonObject()
      }
    }).getJsonString();

    connection.send(response);
  }
}

export function givePlayerLetters(args: SocketArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('playerUpdated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    const state = gameState.givePlayerLetters(args.id.playerId).syncState();

    const response = new WebsocketMethod('playerUpdated', {
      data: {
        player: state.getPlayer(args.id.playerId)!.getJsonObject()
      }
    }).getJsonString();

    connection.send(response);
  }
}

export function endTurn(args: SocketArgs, connection: WebSocket) {
  (async () => {
    if (!args.id) {
      connection.send(idNotPresentResponse('endTurn'));
      return;
    }

    const room = rooms.getRoom(args.id.roomId);

    if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
      const gameState = room.roomData.gameState as GameState;

      if (isNotCurrentPlayer(gameState, room, args.id)) {
        return;
      }

      const errors = await gameState.processTurn();

      const state = gameState.syncState();

      room.emitToRoom<GridStateUpdatedResponseArgs>('gridStateUpdated', {
        data: {
          grid: state.grid
        }
      });

      room.emitToRoom<EndTurnResponseArgs>('endTurn', {
        data: {
          currentPlayer: state.currentPlayer,
          errors: errors,
          gameType: gameState.gameType
        }
      });

      if (gameState.gameType === 'local') {
        const response = new WebsocketMethod<PlayersUpdatedResponseArgs>('playersUpdated', {
          data: {
            players: [...state.players.map(x => x.getJsonObject())]
          }
        }).getJsonString();

        connection.send(response);
      } else if (gameState.gameType === 'online') {
        for (const roomConnection of room.connections) {
          const response = new WebsocketMethod<PlayersUpdatedResponseArgs>('playersUpdated', {
            data: {
              players: [...state.getPlayersOnline(roomConnection.playerId)]
            }
          }).getJsonString();

          roomConnection.connection.send(response);
        }
      }

      if (state.gameOver) {
        room.emitToRoom('gameEnded', {});
        rooms.deleteRoom(args.id.roomId);
      } else if (state.allLettersUsed) {
        room.emitToRoom('gameCanEnd', {});
      }
    }
  })();
}

export function syncGameState(args: SocketArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('syncGameState'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    const state = gameState.syncState();

    const response = new WebsocketMethod<SyncGameStateResponseArgs>('syncGameState', {
      data: {
        grid: state.grid,
        gameOver: state.gameOver,
        allLettersUsed: state.allLettersUsed,
        players: gameState.gameType === 'local' ? [...state.players.map(x => x.getJsonObject())] : [...state.getPlayersOnline(args.id.playerId)],
        currentPlayer: state.currentPlayer
      }
    }).getJsonString();

    connection.send(response);
  }
}

export function handlePlayerLeaving(room: WebsocketRoom, player: Player) {
  const gameState = room.roomData.gameState as GameState;

  if (room.connections.length === 0) {
    rooms.deleteRoom(room.roomId);
  } else {
    room.emitToRoom<PlayerLeftResponseArgs>('playerLeft', {
      data: {
        playerName: player.name
      }
    });

    const state = gameState.syncState();

    // will be online if it made it this far since connections would be 0

    for (const roomConnection of room.connections) {
      const response = new WebsocketMethod<SyncGameStateResponseArgs>('syncGameState', {
        data: {
          grid: state.grid,
          gameOver: state.gameOver,
          allLettersUsed: state.allLettersUsed,
          players: [...state.getPlayersOnline(roomConnection.playerId)],
          currentPlayer: state.currentPlayer
        }
      }).getJsonString();

      roomConnection.connection.send(response);
    }
  }
}

export function leaveGame(args: SocketArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('kicked'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.gameState) {
    const gameState = room.roomData.gameState as GameState;

    gameState.kickPlayer(args.id.playerId);

    const player = gameState.getPlayer(args.id.playerId);

    if (player) {
      room.leave(args.id.socketId);

      handlePlayerLeaving(room, player);
    }
  }
}

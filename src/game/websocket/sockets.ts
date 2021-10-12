import {
  IWebsocketRequestMethod,
  LocalPlayer,
  SocketIdentification,
  WebsocketRequestMethods,
} from '@Types/sharedTypes';
import WebSocket, {Server} from 'ws';
import * as express from 'express';
import {WebsocketRooms} from './websocketRooms';
import {
  checkLobbyStatus,
  createOnlineLobby,
  joinOnlineLobby,
  kickLobbyPlayer,
  leaveOnlineLobby,
  syncLobbyState,
  updateLobbyName
} from '@Websocket/methods/lobby';
import {
  createLocalGame,
  createOnlineGame,
  endTurn,
  givePlayerLetters,
  handlePlayerLeaving,
  leaveGame,
  placeLetter,
  removeBoardLetter,
  removePlayerLetters,
  syncGameState
} from '@Websocket/methods/game';
import {reconnected} from '@Websocket/methods/room';
import {
  CheckLobbyStatusArgs,
  CreateLocalGameArgs,
  CreateOnlineLobbyArgs,
  JoinOnlineLobbyArgs,
  LeaveOnlineLobbyArgs,
  PlaceLetterArgs,
  ReconnectArgs,
  RemoveBoardLetterArgs,
  RemovePlayerLettersArgs,
  SocketArgs,
  UpdateLobbyNameArgs
} from '@Types/requestArgs';
import {LobbyDataUpdatedResponseArgs} from '@Types/responseArgs';

export const rooms = new WebsocketRooms();

function defineWebsocketMethod<T extends SocketArgs>(message: IWebsocketRequestMethod<T>, method: WebsocketRequestMethods, connection: WebSocket, cb: (args: T, connection: WebSocket) => void) {
  if (message.method === method) {
    cb(message.arguments, connection);
  }
}

export let socketsLost: WebSocket[] = [];

export function setSocketsLost(value: WebSocket[]) {
  socketsLost = value;
}

export function initialiseSocket(ws: Server) {
  ws.on('connection', (connection) => {
    connection.on('message', (message) => {
      if (typeof message === 'string') {
        const messageParsed = JSON.parse(message);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<CreateOnlineLobbyArgs>, 'createOnlineLobby', connection, createOnlineLobby);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<CheckLobbyStatusArgs>, 'checkLobbyStatus', connection, checkLobbyStatus);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<JoinOnlineLobbyArgs>, 'joinOnlineLobby', connection, joinOnlineLobby);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<LeaveOnlineLobbyArgs>, 'leaveOnlineLobby', connection, leaveOnlineLobby);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<LeaveOnlineLobbyArgs>, 'kickLobbyPlayer', connection, kickLobbyPlayer);

        defineWebsocketMethod(messageParsed, 'syncLobbyState', connection, syncLobbyState);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<UpdateLobbyNameArgs>, 'updateLobbyName', connection, updateLobbyName);

        defineWebsocketMethod(messageParsed, 'createOnlineGame', connection, createOnlineGame);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<CreateLocalGameArgs>, 'createLocalGame', connection, createLocalGame);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<PlaceLetterArgs>, 'placeLetter', connection, placeLetter);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<RemoveBoardLetterArgs>, 'removeBoardLetter', connection, removeBoardLetter);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<RemovePlayerLettersArgs>, 'removePlayerLetters', connection, removePlayerLetters);

        defineWebsocketMethod(messageParsed, 'givePlayerLetters', connection, givePlayerLetters);

        defineWebsocketMethod(messageParsed, 'endTurn', connection, endTurn);

        defineWebsocketMethod(messageParsed as IWebsocketRequestMethod<ReconnectArgs>, 'reconnected', connection, reconnected);

        defineWebsocketMethod(messageParsed, 'syncGameState', connection, syncGameState);

        defineWebsocketMethod(messageParsed, 'leaveGame', connection, leaveGame);
      }

    });
    connection.on('close', (code) => {
      if (code === 1001 || code === 1006 || code === 1005) {
        socketsLost.push(connection);
        setTimeout(() => {
          if (socketsLost.includes(connection)) {
            const roomConnectionIsIn = rooms.getRoomByConnection(connection);

            if (roomConnectionIsIn) {
              const originalWebsocket = roomConnectionIsIn.getWebsocketConnectionByConnection(connection);

              if (originalWebsocket) {
                roomConnectionIsIn.leave(originalWebsocket.socketId);

                if (roomConnectionIsIn.roomType === 'game') {
                  const targetPlayer = roomConnectionIsIn.roomData.gameState.getPlayer(originalWebsocket.playerId);
                  roomConnectionIsIn.roomData.gameState.kickPlayer(originalWebsocket.playerId);

                  handlePlayerLeaving(roomConnectionIsIn, targetPlayer);
                } else {
                  const targetPlayerIndex = roomConnectionIsIn.roomData.public.players.findIndex((x: LocalPlayer) => x.id === originalWebsocket.playerId);

                  if (targetPlayerIndex !== 1) {
                    roomConnectionIsIn.roomData.public.players[targetPlayerIndex].name = '';
                    roomConnectionIsIn.roomData.public.players[targetPlayerIndex].type = 'Empty';

                    roomConnectionIsIn.emitToRoom<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
                      data: {
                        lobbyData: roomConnectionIsIn.roomData.public
                      }
                    });
                  }
                }

                connection.terminate();
              }
            }
          }
        }, 20000);
      }
    });
  });
}

export const gameStateRouter = express.Router();

gameStateRouter.post('/canExchange', (req, res) => {
  const body = req.body as SocketIdentification;

  const room = rooms.getRoom(body.roomId);

  if (room?.roomData?.gameState) {
    const sync = room.roomData.gameState.syncState();

    return res.json({
      canExchange: sync.allLettersUsed || true
    });
  }

  return res.sendStatus(500).end();
});

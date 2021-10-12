import {nanoid} from 'nanoid';
import {WebsocketMethod} from '@Websocket/websocketMethod';
import {rooms} from '../sockets';
import WebSocket from 'ws';
import {idNotPresentResponse, verifyOnlinePlayer} from './utils';
import {
  CheckLobbyStatusArgs,
  CreateOnlineLobbyArgs,
  JoinOnlineLobbyArgs,
  LeaveOnlineLobbyArgs, SocketArgs,
  UpdateLobbyNameArgs
} from '@Types/requestArgs';
import {LobbyDataUpdatedResponseArgs, OnlineLobbyJoinedResponseArgs} from '@Types/responseArgs';
import {LobbyData, LobbyStatus, LocalPlayer} from '@Types/sharedTypes';

export function createOnlineLobby(args: CreateOnlineLobbyArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('onlineLobbyJoined'));
    return;
  }

  const lobbyId = nanoid(8);

  let response: string;

  const newRoomData: {
    public: LobbyData,
    private: {
      host: string,
      banList: string[]
    }
  } = {
    public: {
      players: [
        {
          id: nanoid(8),
          name: 'host',
          type: 'Human'
        },
        {
          id: nanoid(8),
          name: '',
          type: 'Empty'
        },
        {
          id: nanoid(8),
          name: '',
          type: 'Empty'
        },
        {
          id: nanoid(8),
          name: '',
          type: 'Empty'
        }],
      lobbyId
    },
    private: {
      host: args.id.socketId,
      banList: []
    }
  };

  if (args.addPassword) {
    const inviteCode = nanoid(6).toUpperCase();

    rooms.createPasswordProtectedRoom({
      connection,
      socketId: args.id.socketId,
      playerId: newRoomData.public.players[0].id
    }, lobbyId, inviteCode, newRoomData);

    response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
      data: {
        result: true,
        inviteCode: inviteCode,
        playerId: newRoomData.public.players[0].id,
        isHost: true
      }
    }).getJsonString();
  } else {
    rooms.createRoom({
      connection,
      socketId: args.id.socketId,
      playerId: newRoomData.public.players[0].id
    }, lobbyId, newRoomData);

    response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
      data: {
        result: true,
        playerId: newRoomData.public.players[0].id,
        isHost: true
      }
    }).getJsonString();
  }

  connection.send(response);

  const dataResponse = new WebsocketMethod<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
    data: {
      lobbyData: newRoomData.public
    }
  }).getJsonString();

  connection.send(dataResponse);
}

export function checkLobbyStatus(args: CheckLobbyStatusArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('lobbyStatus'));
    return;
  }

  const room = rooms.getRoom(args.lobbyId);

  const responseArgs = {
    canJoin: true,
    requiresPassword: false,
    reason: ''
  };

  if (!room) {
    responseArgs.canJoin = false;
    responseArgs.reason = 'Lobby Not Found';

    const response = new WebsocketMethod<LobbyStatus>('lobbyStatus', {
      data: responseArgs
    }).getJsonString();

    connection.send(response);
    return;
  }

  if (room.roomData.private.banList.includes(args.id.socketId)) {
    responseArgs.canJoin = false;
    responseArgs.reason = 'You are banned from this lobby';
  }

  const freeSpace = room.roomData.public.players.find((x: LocalPlayer) => x.type === 'Empty');

  if (!freeSpace) {
    responseArgs.canJoin = false;
    responseArgs.reason = 'Lobby full';
  }

  if (room.roomType === 'password') {
    responseArgs.requiresPassword = true;
  }

  const response = new WebsocketMethod<LobbyStatus>('lobbyStatus', {
    data: responseArgs
  }).getJsonString();

  connection.send(response);
}

export function joinOnlineLobby(args: JoinOnlineLobbyArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('onlineLobbyJoined'));
    return;
  }

  const room = rooms.getRoom(args.lobbyId);

  if (room && room.roomData) {
    if (room.roomData.private.banList.includes(args.id.socketId)) {
      const response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
        data: {
          result: false,
          playerId: '',
          isHost: false
        }
      }).getJsonString();

      connection.send(response);
      return;
    }

    if (room && room.roomData.public) {
      if (room.roomType === 'password') {
        if (room.roomData.password.toUpperCase() !== args.password) {
          const response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
            data: {
              result: false,
              playerId: '',
              isHost: false
            }
          }).getJsonString();

          connection.send(response);
          return;
        }
      }

      const freeSpace = room.roomData.public.players.find((x: LocalPlayer) => x.type === 'Empty');

      if (freeSpace === undefined) {
        const response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
          data: {
            result: false,
            playerId: '',
            isHost: false
          }
        }).getJsonString();

        connection.send(response);
        return;
      }

      if (room.roomData.public.players.some((x: LocalPlayer) => x.id === args.id!.playerId)) {
        return;
      }

      const freeSpaceIndex = room.roomData.public.players.indexOf(freeSpace);

      room.join({
        connection,
        socketId: args.id.socketId,
        playerId: freeSpace.id
      });

      room.roomData.public.players[freeSpaceIndex].type = 'Human';

      const response = new WebsocketMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', {
        data: {
          result: true,
          playerId: freeSpace.id,
          isHost: false
        }
      }).getJsonString();

      connection.send(response);

      room.emitToRoom<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
        data: {
          lobbyData: room.roomData.public
        }
      });
    }
  }
}

export function leaveOnlineLobby(args: LeaveOnlineLobbyArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('kicked'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.public) {
    const playerSocketId = room.getSocketIdByPlayerId(args.player.id);

    if (playerSocketId) {
      const targetPlayerIndex = room.roomData.public.players.findIndex((x: LocalPlayer) => x.id === args.player.id);

      if (targetPlayerIndex !== -1) {
        room.roomData.public.players[targetPlayerIndex].name = '';
        room.roomData.public.players[targetPlayerIndex].type = 'Empty';
      }

      room.leave(playerSocketId);

      if (room.roomData.private.host === playerSocketId) {
        room.emitToRoom('kicked', {});
        rooms.deleteRoom(room.roomId);
      } else {
        room.emitToRoom<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
          data: {
            lobbyData: room.roomData.public
          }
        });
      }
    }
  }
}

export function kickLobbyPlayer(args: LeaveOnlineLobbyArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('kicked'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && args.id.socketId === room.roomData.private.host && room.roomData.public) {
    const playerSocketId = room.getSocketIdByPlayerId(args.player.id);

    if (playerSocketId) {
      const targetPlayerConnection = room.getWebsocketConnectionBySocketId(playerSocketId);

      if (targetPlayerConnection) {
        const targetPlayerIndex = room.roomData.public.players.findIndex((x: LocalPlayer) => x.id === args.player.id);

        if (targetPlayerIndex !== -1) {
          room.roomData.public.players[targetPlayerIndex].name = '';
          room.roomData.public.players[targetPlayerIndex].type = 'Empty';
        }

        room.roomData.private.banList.push(playerSocketId);

        const kickNotification = new WebsocketMethod('kicked', {}).getJsonString();

        targetPlayerConnection.connection.send(kickNotification);

        room.leave(playerSocketId);

        if (room.roomData.private.host === playerSocketId) {
          room.emitToRoom('kicked', {});
          rooms.deleteRoom(room.roomId);
        } else {
          room.emitToRoom<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
            data: {
              lobbyData: room.roomData.public
            }
          });
        }
      }
    }
  }
}

export function updateLobbyName(args: UpdateLobbyNameArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('lobbyDataUpdated'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.public) {
    const player = room.roomData.public.players.find((x: LocalPlayer) => x.id === args.id!.playerId);
    player.name = args.name;

    room.emitToRoom<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', {
      data: {
        lobbyData: room.roomData.public
      }
    });
  }
}

export function syncLobbyState(args: SocketArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('syncLobbyState'));
    return;
  }

  const room = rooms.getRoom(args.id.roomId);

  if (room && verifyOnlinePlayer(args.id, room) && room.roomData.public) {
    const response = new WebsocketMethod<LobbyDataUpdatedResponseArgs>('syncLobbyState', {
      data: {
        lobbyData: room.roomData.public
      }
    }).getJsonString();

    connection.send(response);
  }
}

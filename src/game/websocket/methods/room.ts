import WebSocket from 'ws';
import {WebsocketMethod} from '@Websocket/websocketMethod';
import {rooms, setSocketsLost, socketsLost} from '@Websocket/sockets';
import {idNotPresentResponse, verifyOnlinePlayer} from './utils';
import {ReconnectArgs} from '@Types/requestArgs';
import {ReconnectedAckResponseArgs} from '@Types/responseArgs';

export function reconnected(args: ReconnectArgs, connection: WebSocket) {
  if (!args.id) {
    connection.send(idNotPresentResponse('reconnectedAck'));
    return;
  }

  const room = rooms.getRoom(args.roomId);

  if (room && verifyOnlinePlayer(args.id, room)) {
    const oldConnection = room.getWebsocketConnectionBySocketId(args.id.socketId);

    if (room.hasSocketId(args.id.socketId)) {
      room.leave(args.id.socketId);
      room.join({
        connection,
        socketId: args.id.socketId,
        playerId: args.id.playerId
      });

      setSocketsLost(socketsLost.filter(x => x !== oldConnection?.connection));

      const response = new WebsocketMethod<ReconnectedAckResponseArgs>('reconnectedAck', {
        data: {
          success: true
        }
      }).getJsonString();

      connection.send(response);
    }
  } else {
    const response = new WebsocketMethod<ReconnectedAckResponseArgs>('reconnectedAck', {
      data: {
        success: false
      }
    }).getJsonString();

    connection.send(response);
  }
}

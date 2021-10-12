import {SocketIdentification, WebsocketResponseMethods} from '@Types/sharedTypes';
import {WebsocketRoom} from '@Websocket/websocketRoom';
import {GameState} from '@Game/gameState';
import {WebsocketMethod} from '@Websocket/websocketMethod';

export function verifyOnlinePlayer(id: SocketIdentification, room: WebsocketRoom) {
  const playerSocketId = room.getSocketIdByPlayerId(id.playerId);

  if (room.roomType !== 'game') {
    return playerSocketId === id.socketId || room.roomData.private.host === id.socketId;
  } else {
    if (room.roomData.gameState.gameType === 'local') {
      return true;
    }
    return playerSocketId === id.socketId;
  }
}

export function isNotCurrentPlayer(gameState: GameState, room: WebsocketRoom, id: SocketIdentification) {
  if (gameState.gameType === 'local') {
    return false;
  }

  const currentPlayerId = gameState.getCurrentPlayer().playerId;
  const currentPlayerSocketId = room.getSocketIdByPlayerId(currentPlayerId);

  return currentPlayerSocketId !== id.socketId;
}

export const idNotPresentResponse = (method: WebsocketResponseMethods, failureMessage?: string) => {
  return new WebsocketMethod(method, {
    error: {
      message: failureMessage || `${method} - ID is not present`
    }
  }).getJsonString();
};

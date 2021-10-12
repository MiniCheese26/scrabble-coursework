import WebSocket from 'ws';

export class WebsocketRoomConnection {
  connection: WebSocket;
  socketId: string;
  playerId: string;

  constructor(connection: WebSocket, socketId: string, playerId: string) {
    this.connection = connection;
    this.socketId = socketId;
    this.playerId = playerId;
  }
}

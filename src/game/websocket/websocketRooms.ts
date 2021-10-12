import {WebsocketRoom} from './websocketRoom';
import {GameState} from '@Game/gameState';
import WebSocket from 'ws';
import {WebsocketRoomConnection} from './websocketRoomConnection';

export class WebsocketRooms {
  private _rooms: WebsocketRoom[];

  constructor() {
    this._rooms = [];
  }

  createRoom(connection: WebsocketRoomConnection, roomId: string, data?: any) {
    const newRoom = new WebsocketRoom(roomId, 'default', data);
    newRoom.join(connection);
    this._rooms.push(newRoom);
  }

  createGameRoom(connection: WebsocketRoomConnection, roomId: string, gameState: GameState, data: any = {}) {
    const newRoom = new WebsocketRoom(roomId, 'game', {gameState, ...data});
    newRoom.join(connection);
    this._rooms.push(newRoom);
    return newRoom;
  }

  createPasswordProtectedRoom(connection: WebsocketRoomConnection, roomId: string, password: string, data: any = {}) {
    const newRoom = new WebsocketRoom(roomId, 'password', {password, ...data});
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

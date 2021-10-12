import {WebsocketResponseMethods} from '@Types/sharedTypes';
import {WebsocketMethod} from './websocketMethod';
import {WebsocketRoomConnection} from './websocketRoomConnection';
import {RoomType} from '@Types/types';
import WebSocket from 'ws';
import {ResponseArgs} from '@Types/responseArgs';

export class WebsocketRoom {
  private _connections: WebsocketRoomConnection[];
  private readonly _roomId: string;
  private readonly _roomType: RoomType;
  private readonly _roomData: any;

  get roomId(): string {
    return this._roomId;
  }

  get connections(): WebsocketRoomConnection[] {
    return this._connections;
  }

  get roomType(): RoomType {
    return this._roomType;
  }

  get roomData(): any {
    return this._roomData;
  }

  constructor(roomId: string, roomType: RoomType, roomData: any) {
    this._roomId = roomId;
    this._roomType = roomType;
    this._roomData = roomData;
    this._connections = [];
  }

  join(connection: WebsocketRoomConnection) {
    this._connections.push(connection);
  }

  leave(socketId: string) {
    this._connections = this._connections.filter(x => x.socketId !== socketId);
  }

  emitToRoom<T>(method: WebsocketResponseMethods, args: ResponseArgs<T>) {
    const websocketMethod = new WebsocketMethod<T>(method, args).getJsonString();

    for (const connection of this._connections) {
      connection.connection.send(websocketMethod);
    }
  }

  hasSocketId(socketId: string) {
    return this.connections.some(x => x.socketId === socketId);
  }

  hasPlayerId(playerId: string) {
    return this.connections.some(x => x.playerId === playerId);
  }

  getWebsocketConnectionByConnection(connection?: WebSocket): WebsocketRoomConnection | undefined {
    return this.connections.find(x => x.connection === connection);
  }

  getWebsocketConnectionBySocketId(socketId?: string): WebsocketRoomConnection | undefined {
    return this.connections.find(x => x.socketId === socketId);
  }

  getSocketIdByPlayerId(playerId?: string): string | undefined {
    return this.connections.find(x => x.playerId === playerId)?.socketId;
  }
}

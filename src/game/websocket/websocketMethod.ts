import {
  IWebsocketResponseMethod,
  WebsocketResponseMethods
} from '@Types/sharedTypes';
import {ResponseArgs} from '@Types/responseArgs';

export class WebsocketMethod<T> {
  private readonly _websocketMethod: IWebsocketResponseMethod<T>;

  constructor(method: WebsocketResponseMethods, args: ResponseArgs<T>) {
    this._websocketMethod = {
      method,
      arguments: args
    };
  }

  getJsonString() {
    return JSON.stringify(this._websocketMethod);
  }
}

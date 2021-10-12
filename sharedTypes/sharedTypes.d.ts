import {ResponseArgs} from './responseArgs';
import {SocketArgs} from './requestArgs';

export type GamePlayerType = 'Human' | 'Ai' | 'Empty';

export interface LocalPlayer {
  name: string;
  type: GamePlayerType;
  id: string;
}

export interface Letter {
  letter: string;
  value: number
}

export interface SocketIdentification {
  roomId: string;
  playerId: string;
  socketId: string;
}

export interface Coordinate {
  x: number,
  y: number
}

export interface ExchangeLettersArgs {
  letters: Letter[],
  isExchanging: boolean
}

export type GameType = 'local' | 'online' | '';

export interface SharedPlayer {
  playerId: string,
  type: GamePlayerType,
  letters: LetterWithCount[],
  score: number,
  name: string,
  isClient: true
}

export interface SharedPlayerLimited {
  score: number,
  name: string,
  playerId: string,
  isClient: false
}

export interface LetterWithCount extends Letter {
  count: number
}

export type SpecialTileType = 'letter' | 'word' | 'none';

export interface EmptyGameGridItem {
  textColour: string,
  backgroundColour: string,
  topText: string,
  bottomText: string,
  type: SpecialTileType,
  multiplier: number,
  multiplierEnabled: boolean,
  empty: true
}

export interface FilledGameGridItem extends Letter {
  empty: false,
  playerId: string
  orderIndex: number,
  turnIndex: number
}

export type GameGridItem = EmptyGameGridItem | FilledGameGridItem;

export interface GameGridElement<T extends GameGridItem> {
  gridItem: T,
  index: number
}

export type WebsocketResponseMethods =
  'localGameCreated'
  | 'gridStateUpdated'
  | 'playerUpdated'
  | 'playersUpdated'
  | 'gameCanEnd'
  | 'gameEnded'
  | 'reconnectedAck'
  | 'playerLeft'
  | 'onlineLobbyJoined'
  | 'playerJoinedLobby'
  | 'onlineGameCreated'
  | 'playerLeftLobby'
  | 'lobbyStatus'
  | 'lobbyDataUpdated'
  | 'kicked'
  | 'endTurn'
  | 'syncGameState'
  | 'updateLobbyName'
  | 'syncLobbyState';

export type WebsocketRequestMethods =
  'createLocalGame'
  | 'placeLetter'
  | 'removeBoardLetter'
  | 'endTurn'
  | 'removePlayerLetters'
  | 'givePlayerLetters'
  | 'reconnected'
  | 'syncGameState'
  | 'leaveGame'
  | 'createOnlineLobby'
  | 'createOnlineGame'
  | 'joinOnlineLobby'
  | 'leaveOnlineLobby'
  | 'kickLobbyPlayer'
  | 'updateLobbyName'
  | 'checkLobbyStatus'
  | 'syncLobbyState';

export interface IWebsocketRequestMethod<T extends SocketArgs> {
  method: WebsocketRequestMethods,
  arguments: T
}

export interface IWebsocketResponseMethod<T> {
  method: WebsocketResponseMethods,
  arguments: ResponseArgs<T>
}

export interface LobbyStatus { canJoin: boolean, requiresPassword?: boolean, reason: string }

export interface LobbyData {
  players: LocalPlayer[],
  lobbyId: string,
}

export type GamePlayerType = 'Human' | 'Ai' | 'Ignore' | 'Empty';

export interface LocalPlayer {
  name: string;
  type: GamePlayerType;
  id: string;
}

export interface Letter {
  letter: string;
  value: number
}

export interface PlaceLetterArgs {
  targetIndex: number;
  newData: Letter;
  oldIndex?: number;
}

export interface GameSocketIdentification {
  gameId: string;
  socketId: string;
}

export interface Coordinate {
  x: number,
  y: number
}

export interface SocketArgs {
  id?: GameSocketIdentification
}

export interface RemoveBoardLetterArgs extends SocketArgs {
  index: number,
  isBeingMoved: boolean
}

export interface RemovePlayerLettersArgs extends SocketArgs {
  letters: Letter[]
}

export interface EndTurnArgs extends SocketArgs {
  type: GameType
}

export interface CreateLocalGameArgs extends SocketArgs {
  localPlayers: LocalPlayer[]
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
  name: string
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

export type WebsocketMethods =
  "createLocalGame"
  | "placeLetter"
  | "localGameCreated"
  | "gridStateUpdated"
  | "updatePlayer"
  | "removeBoardLetter"
  | "endTurn"
  | "updatePlayers"
  | "removePlayerLetters"
  | "givePlayerLetters"
  | "gameCanEnd"
  | "gameEnded";

export interface IWebsocketMethod {
  method: WebsocketMethods,
  arguments: Object
}

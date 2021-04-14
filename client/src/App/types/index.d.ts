import {LocalPlayer} from "Types/createLocal";
import {
  ExchangeLettersArgs,
  GameSocketIdentification,
  GameType,
  PlaceLetterArgs,
  RemoveBoardLetterArgs, SharedPlayer
} from "Types/sharedTypes";

export type InitOperations = {
  createLocalGame(players: LocalPlayer[]): void
}

export type GameOperations = {
  placeLetter(args: PlaceLetterArgs): void,
  removeBoardLetter(args: RemoveBoardLetterArgs): void,
  endTurn(): void,
  exchangeLetters(args: ExchangeLettersArgs): void,
  leaveGame(): void
}

export type SocketOperations = {
  initOperations: InitOperations,
  gameOperations: GameOperations
};

export type GameData = {
  CurrentGame: CurrentGame,
  Players: SharedPlayer[]
};

export type CurrentGame = {
  active: boolean,
  type: GameType,
  id: GameSocketIdentification
};

export type IndexStates = "creatingLocalGame" | "connectingToSocket" | "notLoading";

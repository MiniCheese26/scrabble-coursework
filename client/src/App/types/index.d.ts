import {LocalPlayer} from "Types/createLocal";
import {
    ExchangeLettersArgs,
    GameSocketIdentification,
    GameType,
    PlaceLetterArgs,
    RemoveBoardLetterArgs
} from "Types/sharedTypes";

export type InitOperations = {
    createLocalGame(players: LocalPlayer[]): void
}

export type GameOperations = {
    placeLetter(args: PlaceLetterArgs): void,
    removeBoardLetter(args: RemoveBoardLetterArgs): void,
    endTurn(): void,
    exchangeLetters(args: ExchangeLettersArgs): void
}

export type SocketOperations = {
    initOperations: InitOperations,
    gameOperations: GameOperations
};

export type CurrentGame = {
    active: boolean,
    type: GameType,
    id: GameSocketIdentification,
    currentPlayer: string
}

export type LetterOperations = {
    onSelect(letter: any): void,
    onDeselect(letter: any): void
}

export type IndexStates = "creatingLocalGame" | "notLoading";
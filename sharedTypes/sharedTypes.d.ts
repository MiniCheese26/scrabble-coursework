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
}

export interface GameSocketIdentification {
    gameId: string;
    socketId: string;
}

export interface Coordinate {
    x: number,
    y: number
}

export interface RemoveBoardLetterArgs {
    index: number
}

export interface ExchangeLettersArgs {
    letters: Letter[]
}

export type GameType = 'local' | 'online' | '';

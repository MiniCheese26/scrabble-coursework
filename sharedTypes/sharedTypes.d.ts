export type GameStatePlayerType = 'Human' | 'Ai' | 'Ignore' | 'Empty';
export type GameStateGridIndexType = 'Empty' | 'Filled';

export interface LocalPlayer {
    name: string;
    type: GameStatePlayerType;
    id: string;
}

export interface CreateOfflinePlayersResponse {
    roomId: string;
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

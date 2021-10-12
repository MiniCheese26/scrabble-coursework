import {GameType, Letter, SharedPlayer, SharedPlayerLimited} from 'Types/sharedTypes';

export type GameData = {
  CurrentGame: CurrentGame,
  Players: (SharedPlayer | SharedPlayerLimited)[]
};

export type CurrentGame = {
  active: boolean,
  type: GameType
};

export type IndexStates = 'creatingLocalGame' | 'connectingToSocket' | 'notLoading';

export type LetterTradeToggleType = 'select' | 'deselect';

export type LetterDragItem = {
  type: 'letter'
} & Letter;

export type GridDragItem = {
  index: number,
  type: 'gridLetter'
} & Letter;

export type JoinResult = {
  result: boolean
  inviteCode?: string,
  playerId: string,
  isHost: boolean
};

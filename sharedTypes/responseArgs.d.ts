import {GameGridElement, GameGridItem, GameType, LobbyData, SharedPlayer, SharedPlayerLimited} from './sharedTypes';

export interface ResponseArgsErrors {
  message: string
}

export interface ResponseArgs<T extends Record<string, any>> {
  data?: T;
  error?: ResponseArgsErrors;
}

export interface GameCreatedResponseArgs {
  grid: GameGridElement<GameGridItem>[],
  gameId: string,
  players: (SharedPlayer | SharedPlayerLimited)[],
  currentPlayer: string
}

export interface GridStateUpdatedResponseArgs {
  grid: GameGridElement<GameGridItem>[]
}

export interface OnlineLobbyJoinedResponseArgs {
  result: boolean,
  inviteCode?: string,
  playerId: string,
  isHost: boolean
}

export interface PlayerUpdatedResponseArgs {
  player: SharedPlayer
}

export interface PlayersUpdatedResponseArgs {
  players: (SharedPlayer | SharedPlayerLimited)[]
}

export interface EndTurnResponseArgs {
  currentPlayer: string,
  errors: string[],
  gameType: GameType
}

export interface ReconnectedAckResponseArgs {
  success: boolean
}

export interface SyncGameStateResponseArgs {
  grid: GameGridElement<GameGridItem>[],
  gameOver: boolean,
  allLettersUsed: boolean,
  players: (SharedPlayer | SharedPlayerLimited)[],
  currentPlayer: string
}

export interface PlayerLeftResponseArgs {
  playerName: string
}

export interface LobbyStatusResponseArgs {
  canJoin: boolean,
  requiresPassword?: boolean,
  reason: string
}

export interface LobbyDataUpdatedResponseArgs {
  lobbyData: LobbyData
}

import {ChangeEvent, MutableRefObject} from 'react';
import SocketOperations from 'Pages/index/socketOperations';
import LocalStateChangeEmitter from 'Pages/index/localStateChangeEmitter';
import {
  GameGridItem,
  GamePlayerType,
  SocketIdentification,
  Letter,
  LocalPlayer,
  SharedPlayer, SharedPlayerLimited
} from 'Types/sharedTypes';
import {LetterTradeToggleType} from 'Types/types';

export type CreateLocalProps = {
  socketOperations: MutableRefObject<SocketOperations>
};

export type LetterProps = {
  letter: string,
  value: number,
  isTradingLetters: boolean,
  onLetterTradeToggled(letter: Letter, type: LetterTradeToggleType): void
};

export type BothSocketProps = {
  socketOperations: MutableRefObject<SocketOperations>,
  localStateChangeEmitter: MutableRefObject<LocalStateChangeEmitter>
};

export type SocketOperationProps = {
  socketOperations: MutableRefObject<SocketOperations>
};

export type StateChangeEmitterProps = {
  localStateChangeEmitter: MutableRefObject<LocalStateChangeEmitter>
};

export type PlayerProps = {
  player: LocalPlayer,
  handlePlayers(this: void, newType: GamePlayerType, index: number): void,
  handleInput(this: void, e: ChangeEvent<HTMLInputElement>, index: number): void
};

export type PlayerSelectedProps = {
  id: string,
  player: LocalPlayer,
  handlePlayers(newType: GamePlayerType, index: number): void,
  handleInput(e: ChangeEvent<HTMLInputElement>, index: number): void
};

export type PlayerAddProps = {
  id: string,
  handlePlayers(newType: GamePlayerType, index: number): void,
};

export type GridItemProps = {
  gridItem: GameGridItem,
  index: number,
  socketOperations: MutableRefObject<SocketOperations>
};

export type JoinedOnlinePlayerProps = {
  isHost: boolean,
  player: LocalPlayer,
  lobbyId: string,
  id?: SocketIdentification,
  socketOperations: MutableRefObject<SocketOperations>
};

export type OnlinePlayerProps = {
  player: LocalPlayer,
  isHost: boolean,
  lobbyId: string,
  id?: SocketIdentification,
  socketOperations: MutableRefObject<SocketOperations>
};

export type ScoreItemProps = {
  name: string,
  score: number | string
};

export type YesNoPromptProps = {
  question: string,
  onYes: () => void,
  onNo: () => void
};

export type GameOverProps = {
  players: (SharedPlayer | SharedPlayerLimited)[];
};

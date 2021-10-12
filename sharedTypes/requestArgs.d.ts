import {Letter, LocalPlayer, SocketIdentification} from './sharedTypes';

export interface SocketArgs {
  id?: SocketIdentification
}

export interface RemoveBoardLetterArgs extends SocketArgs {
  index: number,
  isBeingMoved: boolean
}

export interface PlaceLetterArgs extends SocketArgs {
  targetIndex: number;
  newData: Letter;
  oldIndex?: number;
}

export interface RemovePlayerLettersArgs extends SocketArgs {
  letters: Letter[]
}

export interface CreateLocalGameArgs extends SocketArgs {
  localPlayers: LocalPlayer[]
}

export interface CreateOnlineLobbyArgs extends SocketArgs {
  addPassword: boolean
}

export interface JoinOnlineLobbyArgs extends SocketArgs {
  password?: string,
  lobbyId: string
}

export interface LeaveOnlineLobbyArgs extends SocketArgs {
  player: LocalPlayer
}

export interface UpdateLobbyNameArgs extends SocketArgs {
  name: string
}

export interface ReconnectArgs extends SocketArgs {
  roomId: string
}

export interface CheckLobbyStatusArgs extends SocketArgs {
  lobbyId: string
}

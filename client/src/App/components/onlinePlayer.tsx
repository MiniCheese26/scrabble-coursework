import React from 'react';
import {JoinedOnlinePlayer} from 'Components/joinedOnlinePlayer';
import {OnlinePlayerProps} from 'Types/props';
import { EmptyWrapper } from 'Styles/layout/lobbyCard';

export default function OnlinePlayer(props: OnlinePlayerProps) {
  if (props.player.type === 'Empty') {
    return (
      <EmptyWrapper>
        <p>Waiting for player to join...</p>
      </EmptyWrapper>
    );
  } else {
    return (
      <JoinedOnlinePlayer isHost={props.isHost} player={props.player} socketOperations={props.socketOperations}
                          lobbyId={props.lobbyId} id={props.id}/>
    );
  }
}


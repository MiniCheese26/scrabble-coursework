import React, {useRef} from 'react';
import {
  AddedPlayerWrapper,
  AddedPlayerWrapperRow,
  PlayerDetailsWrapper,
  PlayerImage,
  PlayerName,
  RemovePlayer,
  TickBox
} from 'Styles/layout/lobbyCard';
import {JoinedOnlinePlayerProps} from 'Types/props';

export function JoinedOnlinePlayer(props: JoinedOnlinePlayerProps) {
  const playerName = useRef<HTMLInputElement>(null);

  const onTickClick = () => {
    if (playerName.current) {
      if (playerName.current.value.trim() !== props.player.name) {
        props.socketOperations.current.setLobbyName({
          name: playerName.current.value.trim(),
        });
      }
    }
  };

  const isClient = props.id?.playerId === props.player.id;

  return (
    <AddedPlayerWrapper>
      <AddedPlayerWrapperRow>
        <PlayerDetailsWrapper>
          <PlayerImage/>
          {isClient ?
            <PlayerName key={props.player.name} ref={playerName} defaultValue={props.player.name}
                        placeholder='Player Name' maxLength={12}/> :
            <PlayerName ref={playerName} value={props.player.name} placeholder='Player Name' maxLength={12}/>}
          {isClient ? <TickBox onClick={() => onTickClick()}/> : null}
        </PlayerDetailsWrapper>
      </AddedPlayerWrapperRow>
      {
        props.isHost ? (
          <AddedPlayerWrapperRow>
            <RemovePlayer
              onClick={() => props.socketOperations.current.kickFromLobby({
                player: props.player,
              })}>X</RemovePlayer>
          </AddedPlayerWrapperRow>
        ) : null
      }
    </AddedPlayerWrapper>
  );
}

import * as React from 'react';
import {ChangeEvent} from 'react';
import {
  AddedPlayerWrapper,
  AddedPlayerWrapperRow,
  AiImage,
  PlayerDetailsWrapper,
  PlayerImage,
  PlayerName,
  RemovePlayer
} from 'Styles/layout/lobbyCard';
import {PlayerSelectedProps} from 'Types/props';

export default function AddedPlayer(props: PlayerSelectedProps): JSX.Element {
  const image = props.player.type === 'Human' ? <PlayerImage/> : <AiImage/>;

  const name = props.player.type === 'Human'
    ? <PlayerName defaultValue={props.player.name} placeholder='Player Name' maxLength={12}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => props.handleInput(e, Number.parseInt(props.id))}/>
    : <PlayerName value={props.player.name} readOnly={true}/>;

  return (
    <AddedPlayerWrapper>
      <AddedPlayerWrapperRow>
        <PlayerDetailsWrapper>
          {image}
          {name}
        </PlayerDetailsWrapper>
      </AddedPlayerWrapperRow>
      <AddedPlayerWrapperRow>
        <RemovePlayer onClick={() => props.handlePlayers('Empty', Number.parseInt(props.id))}>X</RemovePlayer>
      </AddedPlayerWrapperRow>
    </AddedPlayerWrapper>
  );
}

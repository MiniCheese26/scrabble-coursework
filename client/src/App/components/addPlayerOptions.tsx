import {AddOption} from 'Styles/layout/lobbyCard';
import React from 'react';
import {PlayerAddProps} from 'Types/props';
import {LocalEmptyPlayerWrapper} from 'Styles/layout/lobbyCard';

export default function AddPlayerOptions(props: PlayerAddProps): JSX.Element {
  return (
    <LocalEmptyPlayerWrapper>
      <AddOption onClick={() => props.handlePlayers('Human', Number.parseInt(props.id))}>Player</AddOption>
      <AddOption onClick={() => props.handlePlayers('Ai', Number.parseInt(props.id))}>AI</AddOption>
    </LocalEmptyPlayerWrapper>
  );
}

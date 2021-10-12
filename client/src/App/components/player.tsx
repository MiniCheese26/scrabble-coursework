import AddPlayerOptions from './addPlayerOptions';
import AddedPlayer from './addedPlayer';
import React from 'react';
import {PlayerProps} from 'Types/props';

export default function Player(props: PlayerProps): JSX.Element {
  if (props.player.type === 'Empty') {
    return <AddPlayerOptions id={props.player.id} handlePlayers={props.handlePlayers}/>;
  } else {
    return <AddedPlayer id={props.player.id} handlePlayers={props.handlePlayers} player={props.player}
                        handleInput={props.handleInput}/>;
  }
}

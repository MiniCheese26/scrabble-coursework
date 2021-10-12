import React from 'react';
import {useWebsocketEventRef, useWebsocketEventVariedIO} from 'Hooks/useWebsocketEvent';
import {GameData} from 'Types/types';
import {StateChangeEmitterProps} from 'Types/props';
import styled from 'styled-components';

const CurrentPlayerAreaWrapper = styled.div`
  display: flex;
  padding-bottom: 0.3rem;
  border-bottom: #162127 solid 2px;
`;

const CurrentPlayerStyle = styled.h2`
  font-size: 28px;
  text-align: center;
`;

export default function CurrentPlayer(props: StateChangeEmitterProps): JSX.Element {
  const currentPlayerId = useWebsocketEventRef<string>(props.localStateChangeEmitter.current.currentPlayerIdUpdated, '');

  const currentPlayerName = useWebsocketEventVariedIO<GameData, string>(props.localStateChangeEmitter.current.gameDataUpdated, (data) => {
    const currentPlayer = data.Players.find(x => x.playerId === currentPlayerId.current);

    if (currentPlayer) {
      return currentPlayer.name;
    } else {
      return '';
    }
  }, '');

  return (
    <CurrentPlayerAreaWrapper>
      <CurrentPlayerStyle>Current Player: {currentPlayerName}</CurrentPlayerStyle>
    </CurrentPlayerAreaWrapper>
  );
}

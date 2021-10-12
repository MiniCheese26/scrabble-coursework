import React from 'react';
import {SharedPlayer, SharedPlayerLimited} from 'Types/sharedTypes';
import ScoreRow from 'Components/scoreRow';
import {useWebsocketEventVariedIO} from 'Hooks/useWebsocketEvent';
import {GameData} from 'Types/types';
import {StateChangeEmitterProps} from 'Types/props';
import styled from 'styled-components';

const ScoresWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.3rem;
  border-bottom: #162127 2px solid;
  margin-top: 0.3rem;
  max-height: 200px;
`;

export default function Scores(props: StateChangeEmitterProps) {
  const players = useWebsocketEventVariedIO<GameData, (SharedPlayer | SharedPlayerLimited)[]>(
    props.localStateChangeEmitter.current.gameDataUpdated,
    (data) => [...data.Players],
    []);

  return (
    <ScoresWrapper>
      <ScoreRow name={'Player'} score={'Score'}/>
      {players!.map(x => <ScoreRow score={x.score} name={x.name}/>)}
    </ScoresWrapper>
  );
}



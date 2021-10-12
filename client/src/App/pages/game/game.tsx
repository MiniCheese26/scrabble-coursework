import React, {useState} from 'react';
import GridItem from 'Components/gridItem';
import {Prompt, useHistory, useLocation} from 'react-router-dom';
import {GameGridElement, GameGridItem} from 'Types/sharedTypes';
import GameOver from 'Pages/game/gameOver/gameOver';
import useWebsocketEvent from '../../hooks/useWebsocketEvent';
import {BothSocketProps} from 'Types/props';
import {GameData, IndexStates} from 'Types/types';
import styled from 'styled-components';

const GameWrapper = styled.div`
  display: grid;
  grid-template: repeat(15, 1fr) / repeat(15, 1fr);
  justify-items: stretch;
  width: 100%;
  height: 100%;
`;

export default function Game(props: BothSocketProps): React.ReactElement {
  const PATH = '/game';
  const history = useHistory();
  const location = useLocation<{ isHost: boolean }>();

  const [firstFetchDone, setFirstFetchDone] = useState(false);
  const grid = useWebsocketEvent<GameGridElement<GameGridItem>[]>(props.localStateChangeEmitter.current.gridUpdated, []);
  const gameIsOver = useWebsocketEvent<boolean>(props.localStateChangeEmitter.current.gameIsOverUpdated, false);
  const loadingState = useWebsocketEvent<IndexStates>(props.localStateChangeEmitter.current.loadingStateUpdated, 'notLoading');
  const gameData = useWebsocketEvent<GameData>(props.localStateChangeEmitter.current.gameDataUpdated);
  const socketIsConnected = useWebsocketEvent<boolean>(props.localStateChangeEmitter.current.socketIsConnectedUpdated, false);
  const shouldReconnect = useWebsocketEvent<boolean>(props.localStateChangeEmitter.current.shouldReconnectUpdated, false);

  history.listen(location => {
    if (location.pathname !== PATH) {
      props.socketOperations.current.leaveGame();
    }
  });

  if (location.state && !location.state.isHost && !firstFetchDone) {
    props.socketOperations.current.syncGameState();
    setFirstFetchDone(true);
  }

  if (gameIsOver) {
    return (<GameOver players={gameData!.Players}/>);
  } else if (loadingState === 'creatingLocalGame') {
    return (<p>Loading...</p>);
  } else if (shouldReconnect && socketIsConnected) {
    return (<p>Reconnecting...</p>);
  }

  const gridItems = grid!.map(
    x => <GridItem key={x.index} gridItem={x.gridItem} index={x.index} socketOperations={props.socketOperations}/>,
  );

  return (
    <>
      <Prompt message={'Are you sure you want to leave this game?'}/>
      <GameWrapper>
        {gridItems}
      </GameWrapper>
    </>
  );
}

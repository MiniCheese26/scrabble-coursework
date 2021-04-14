import React, {useEffect} from 'react';
import {GameWrapper} from 'Styles/game/game/styles';
import {GameProps} from 'Types/game';
import GridItem from 'Components/gridItem';
import {Prompt} from 'react-router-dom';

export default function Game(props: GameProps): React.ReactElement {
  const gridItems = props.grid.map(
    x => <GridItem key={x.index} gridItem={x.gridItem} index={x.index} gameOperations={props.socketOperations}/>,
  );

  useEffect(() => {
    return function cleanup() {
      //console.log("cleaning up");
      //props.socketOperations.leaveGame();
    };
  });

  return (
    <>
      <Prompt message={"Are you sure you want to leave this game?"}/>
      <GameWrapper>
        {gridItems}
      </GameWrapper>
    </>
  );
}

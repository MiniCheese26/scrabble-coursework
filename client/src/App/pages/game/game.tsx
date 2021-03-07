import React from 'react';
import {GameWrapper} from 'Styles/game/game/styles';
import {GameProps} from 'Types/game';
import GridItem from 'Components/gridItem';
import {Prompt} from 'react-router-dom';

export default function Game(props: GameProps): React.ReactElement {
  const gridItems = props.grid.map(
    x => <GridItem key={x.index} gridItem={x.gridItem} index={x.index} gameOperations={props.socketOperations}/>,
  );

  return (
    <>
      <Prompt message={"Are you sure you want to leave this game?"}/>
      <GameWrapper>
        {gridItems}
      </GameWrapper>
    </>
  );
}

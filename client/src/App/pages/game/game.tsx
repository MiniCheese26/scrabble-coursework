import React from 'react';
import { GameWrapper } from 'Styles/game/game/styles';
import { GameProps } from 'Types/game';
import GridItem from 'Components/gridItem';

export default function Game(props: GameProps): React.ReactElement {
  /* const getGridItems = (): JSX.Element[] => {
      const gridItems = [];

      for (let i = 0; i < GRID_HEIGHT * GRID_WIDTH; i++) {
          const initialCoordinate = indexToXY(i);
          const mirroredCoordinates = mirrorCoordinates(initialCoordinate.x, initialCoordinate.y);

          const specialTile = SPECIAL_COORDINATES[mirroredCoordinates[0].y][mirroredCoordinates[0].x] ?? new EmptyTile();

          gridItems.push(
              <GridItem key={i} index={i} gridItem={specialTile}/>
          );
      }

      return gridItems;
  }; */

  const gridItems = props.grid.map(
    (x: any) => <GridItem key={x.index} gridItem={x.gridItem} index={x.index} gameOperations={props.socketOperations}/>,
  );

  return (
    <GameWrapper>
      {gridItems}
    </GameWrapper>
  );
}

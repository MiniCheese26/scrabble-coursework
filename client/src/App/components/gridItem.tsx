import React from 'react';
import {FreeGridItemElement, GridText, UsedGridItemElement} from 'Styles/components/gridItem/styles';
import {GridItemProps} from 'Types/gridItem';
import {useDrag, useDrop} from 'react-dnd';
import {LetterDragItem} from 'Types/letterItem';
import {Letter} from "Types/sharedTypes";

export type GridDragItem = {
  index: number,
  type: "gridLetter"
} & Letter;

export default function GridItem(props: GridItemProps): React.ReactElement {
  const [, drop] = useDrop<LetterDragItem | GridDragItem, unknown, HTMLDivElement>({
    accept: ['letter', 'gridLetter'],
    drop: (item) => {
      switch (item.type) {
        case "letter":
          props.gameOperations.placeLetter({
            targetIndex: props.index,
            newData: {
              letter: item.letter,
              value: item.value,
            }
          });
          break;
        case "gridLetter":
          props.gameOperations.removeBoardLetter({
            index: item.index
          });
          props.gameOperations.placeLetter({
            targetIndex: props.index,
            newData: {
              letter: item.letter,
              value: item.value
            }
          });
          break;
      }
    },
    canDrop: () => {
      return props.gridItem.empty === true;
    },
  });

  const [, drag] = useDrag<GridDragItem, unknown, unknown>({
    item: {
      type: "gridLetter",
      index: props.index,
      letter: props.gridItem.letter,
      value: props.gridItem.value
    }
  });

  if (props.gridItem.empty) {
    return (
      <FreeGridItemElement textColour={props.gridItem.textColour}
                           backgroundColour={props.gridItem.backgroundColour} ref={drop}>
        <GridText gridArea={'topText'}>{props.gridItem.topText}</GridText>
        <GridText gridArea={'bottomText'} fontSize={0.8}>{props.gridItem.bottomText}</GridText>
      </FreeGridItemElement>
    );
  } else {
    return (
      <UsedGridItemElement ref={drag}>
        <GridText gridArea={'letter'}>{props.gridItem.letter}</GridText>
        <GridText gridArea={'value'} fontSize={0.8}>{props.gridItem.value}</GridText>
      </UsedGridItemElement>
    );
  }
}

import React from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {GridItemProps} from 'Types/props';
import {GridDragItem, LetterDragItem} from 'Types/types';
import styled from 'styled-components';

const GridItemElement = styled.div`
  text-align: center;
  border: 1px solid black;
  place-items: center;
  padding: 0.2rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const FreeGridItemElement = styled(GridItemElement)<{backgroundColour: string, textColour: string}>`
  background: ${props => props.backgroundColour};
  color: ${props => props.textColour};
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
          '. topText .'
          '. bottomText .';
`;

const UsedGridItemElement = styled(GridItemElement)`
  background: #E8DAB2;
  color: black;
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
          '. . .'
          '. letter .'
          '. . value';
`;

const GridText = styled.p<{gridArea: string, fontSize?: number}>`
  grid-area: ${props => props.gridArea};
  font-size: ${props => props.fontSize || 1.0};
`;

export default function GridItem(props: GridItemProps): React.ReactElement {
  const [,drop] = useDrop<LetterDragItem | GridDragItem, unknown, unknown>({
    accept: ['letter', 'gridLetter'],
    drop: (item) => {
      switch (item.type) {
        case 'letter':
          if (item.letter === '') {
            const customLetter = prompt('Enter the desired letter');

            if (customLetter && customLetter.trim() !== '' && customLetter.length === 1) {
              props.socketOperations.current.placeLetter({
                targetIndex: props.index,
                newData: {
                  letter: customLetter.toUpperCase(),
                  value: item.value
                }
              });
            }
          } else {
            props.socketOperations.current.placeLetter({
              targetIndex: props.index,
              newData: {
                letter: item.letter,
                value: item.value,
              },
            });
          }
          break;
        case 'gridLetter':
          props.socketOperations.current.removeBoardLetter({
            index: item.index,
            isBeingMoved: true
          });
          props.socketOperations.current.placeLetter({
            targetIndex: props.index,
            newData: {
              letter: item.letter,
              value: item.value,
            },
            oldIndex: item.index
          });
          break;
      }
    },
    canDrop: () => {
      return props.gridItem.empty;
    },
  });

  const [, drag] = useDrag<GridDragItem, unknown, unknown>({
    item: {
      type: 'gridLetter',
      index: props.index,
      letter: props.gridItem.empty ? '#' : props.gridItem.letter,
      value: props.gridItem.empty ? -1 : props.gridItem.value
    },
    canDrag: () => {
      return !props.gridItem.empty;
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

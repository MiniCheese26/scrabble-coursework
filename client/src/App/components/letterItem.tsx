import React, {useRef, useState} from 'react';
import {useDrag} from 'react-dnd';
import { LetterBox, LetterText, LetterTradingSelecter, LetterValue } from 'Styles/layout/letter';
import {LetterProps} from 'Types/props';
import {LetterDragItem} from 'Types/types';

export default function LetterItem(props: LetterProps): JSX.Element {
  const [isSelected, setIsSelected] = useState(false);
  const latestIsSelected = useRef(isSelected);

  const [, drag] = useDrag<LetterDragItem, unknown, unknown>({
    item: {
      type: 'letter',
      letter: props.letter,
      value: props.value,
    },
    canDrag: () => {
      return !props.isTradingLetters;
    }
  });

  const onClick = () => {
    props.onLetterTradeToggled({letter: props.letter, value: props.value}, latestIsSelected.current ? 'deselect' : 'select');
    setIsSelected(prev => {
      latestIsSelected.current = !latestIsSelected.current;
      return !prev;
    });
  };

  return (
    <LetterBox onClick={onClick} ref={drag}>
      <LetterTradingSelecter selected={isSelected} shouldDisplay={props.isTradingLetters}/>
      <LetterText>{props.letter}</LetterText>
      <LetterValue>{props.value}</LetterValue>
    </LetterBox>
  );
}

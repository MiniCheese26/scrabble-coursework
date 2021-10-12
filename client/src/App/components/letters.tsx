import React, {useState} from 'react';
import LetterItem from 'Components/letterItem';
import {useDrop} from 'react-dnd';
import {SocketIdentification, Letter, LetterWithCount} from 'Types/sharedTypes';
import {useWebsocketEventRef, useWebsocketEventVariedIO} from 'Hooks/useWebsocketEvent';
import {BothSocketProps} from 'Types/props';
import {GameData, GridDragItem, LetterTradeToggleType} from 'Types/types';
import {ExchangeLettersButton, LetterItemsWrapper, LettersAreaWrapper, LettersHeader } from 'Styles/layout/letter';


export default function Letters(props: BothSocketProps): JSX.Element {
  // use ref has to be used here as it's referenced in a closure.
  // references to the state in closures will become stale
  const id = useWebsocketEventRef<SocketIdentification>(props.localStateChangeEmitter.current.idUpdated);
  const playerLetters = useWebsocketEventVariedIO<GameData, LetterWithCount[]>(props.localStateChangeEmitter.current.gameDataUpdated, (data) => {
    const currentPlayer = data.Players.find(x => x.playerId === id.current?.playerId);

    if (currentPlayer?.isClient) {
      return currentPlayer.letters;
    } else {
      return [];
    }
  }, []);

  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [isTradingLetters, setIsTradingLetters] = useState(false);

  const onLetterTradeToggled = (letter: Letter, type: LetterTradeToggleType) => {
    if (type === 'select') {
      setSelectedLetters(prev => [...prev, letter]);
    } else {
      setSelectedLetters(prev => prev.filter(x => x === letter));
    }
  };

  const letters = [];

  for (const letter of playerLetters!) {
    for (let i = 0; i < letter.count; i++) {

      // Work on implementing some sort of unique id for the key
      letters.push(
        <LetterItem onLetterTradeToggled={onLetterTradeToggled} isTradingLetters={isTradingLetters}
                    letter={letter.letter} value={letter.value}/>
      );
    }
  }

  const [, drop] = useDrop<GridDragItem, unknown, unknown>({
    accept: 'gridLetter',
    drop: (item => {
      props.socketOperations.current.removeBoardLetter({
        index: item.index,
        isBeingMoved: false
      });
    })
  });

  const onClickTradingLetters = () => {
    if (isTradingLetters && selectedLetters.length > 0) {
      props.socketOperations.current.exchangeLetters({letters: selectedLetters, isExchanging: true});
    }

    setSelectedLetters(() => []);
    setIsTradingLetters(prev => !prev);
  };

  return (
    <LettersAreaWrapper ref={drop}>
      <LettersHeader>Your Letters</LettersHeader>
      <LetterItemsWrapper>
        {letters}
      </LetterItemsWrapper>
      <ExchangeLettersButton
        onClick={() => onClickTradingLetters()}>{isTradingLetters ? 'Submit' : 'Trade Letters'}</ExchangeLettersButton>
    </LettersAreaWrapper>
  );
}

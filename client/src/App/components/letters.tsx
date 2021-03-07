import React, {useState} from "react";
import {
  LettersAreaWrapper,
  LettersHeader,
  LetterItemsWrapper,
  ExchangeLettersButton
} from "Styles/components/letter/styles";
import LetterItem from "Components/letterItem";
import {useDrop} from "react-dnd";
import {GridDragItem} from "./gridItem";
import {Letter} from "Types/sharedTypes";
import {LetterTradeToggleType} from "Types/letterItem";
import {LettersProps} from "Types/letters";

export default function Letters(props: LettersProps): JSX.Element {
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [isTradingLetters, setIsTradingLetters] = useState(false);

  const onLetterTradeToggled = (letter: Letter, type: LetterTradeToggleType) => {
    if (type === "select") {
      setSelectedLetters(prev => [...prev, letter]);
    } else {
      setSelectedLetters(prev => prev.filter(x => x === letter));
    }
  };

  const letters = [];

  for (const letter of props.letters) {
    for (let i = 0; i < letter.count; i++) {

      // Work on implementing some sort of unique id for the key
      letters.push(
        <LetterItem onLetterTradeToggled={onLetterTradeToggled} isTradingLetters={isTradingLetters}
                    letter={letter.letter} value={letter.value}/>
      );
    }
  }

  const [, drop] = useDrop<GridDragItem, unknown, unknown>({
    accept: "gridLetter",
    drop: (item => {
      props.gameOperations.removeBoardLetter({
        index: item.index
      });
    })
  });

  const onClickTradingLetters = () => {
    if (isTradingLetters && selectedLetters.length > 0) {
      props.gameOperations.exchangeLetters({letters: selectedLetters});
    }

    setSelectedLetters([]);
    setIsTradingLetters(prev => !prev);
  }

  return (
    <LettersAreaWrapper ref={drop}>
      <LettersHeader>Your Letters</LettersHeader>
      <LetterItemsWrapper>
        {letters}
      </LetterItemsWrapper>
      <ExchangeLettersButton
        onClick={() => onClickTradingLetters()}>{isTradingLetters ? "Submit" : "Trade Letters"}</ExchangeLettersButton>
    </LettersAreaWrapper>
  );
}
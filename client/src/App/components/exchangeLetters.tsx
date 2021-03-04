import React from "react";
import {ExchangeLettersButton} from "Styles/components/letter/styles";

type TradeLettersProps = {
  toggleTradingLetters(): void,
  isTradingLetters: boolean
}

export default function ExchangeLetters(props: TradeLettersProps) {
  const tradeLetterButton = props.isTradingLetters
    ? <ExchangeLettersButton onClick={() => props.toggleTradingLetters()}>Submit</ExchangeLettersButton>
    : <ExchangeLettersButton onClick={() => props.toggleTradingLetters()}>Trade Letters</ExchangeLettersButton>;

  return (
    tradeLetterButton
  );
}
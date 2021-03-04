import styled from "styled-components";
import {Style} from "react-dnd-preview";
import {GameButton} from "Styles/globalStyles";
import {CheckmarkCircleOutline} from "@styled-icons/evaicons-outline/";

export const LettersAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 200px;
  padding-bottom: 0.3rem;
  border-bottom: #162127 2px solid;
`;

export const LettersHeader = styled.h1`
  font-size: 1.6rem;
  text-align: center;
  flex: 1;
  margin-bottom: 0.3rem;
`;

export const LetterItemsWrapper = styled.div`
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(4, 1fr);
  grid-gap: 0.5rem;
  width: 100%;
  place-items: stretch;
  flex: 3;
`;

export const LetterBox = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  grid-template-areas:
          "trade . ."
          ". letter ."
          ". . value";
  align-items: center;
  justify-items: center;
  background: white;
  border: 1px black solid;
  padding: 0.2rem;
  color: black;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  max-height: 70px;
`;

export const PreviewLetterBox = styled(LetterBox).attrs<Style>((props) => ({
  style: {
    left: props.left,
    top: props.top,
    pointerEvents: props.pointerEvents,
    position: props.position,
    transform: props.transform,
    WebkitTransform: props.WebkitTransform,
  }
}))<Style>`
  opacity: 0.5;
  width: 50px;
  height: 50px;
`;

export const LetterText = styled.p`
  font-size: 1rem;
  grid-area: letter;
`;

export const LetterValue = styled.p`
  font-size: 0.8rem;
  grid-area: value;
`;

export const LetterTradingSelect = styled(CheckmarkCircleOutline)<{ selected: boolean, shouldDisplay: boolean }>`
  color: ${props => props.selected ? "#00ff2f" : "#535050"};
  opacity: ${props => props.shouldDisplay ? 1 : 0};
  grid-area: trade;
  margin-top: 0.3rem;
`;

export const ExchangeLettersButton = styled.button`
  ${GameButton};
  flex: 1;
  max-height: 70px;
  margin-top: 0.3rem;
`;
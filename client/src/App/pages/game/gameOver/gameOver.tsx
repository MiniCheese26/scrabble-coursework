import React from 'react';
import {GameOverProps} from 'Types/props';
import styled from 'styled-components';
import { BankOptionLink } from 'Styles/layout/back';

const GameOverWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  background: white;
  margin: auto;
`;

const GameOverRow = styled.div`
  flex: 1;
  display: flex;
  padding: 0.4rem;
  border-bottom: 1px solid black;
  align-items: center;
  justify-content: center;
  width: 100%;

  &:nth-last-child {
    border-bottom: unset;
  }
`;

const GameOverBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;

  &:first-child:not(:only-child) {
    border-right: 1px solid black;
  }
`;

const GameOverText = styled.p`
  font-size: 18px;
`;

const GameOverWinner = styled.p`
  font-size: 22px;
`;

export default function GameOver(props: GameOverProps) {
  const sortedPlayers = props.players.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <>
      <BankOptionLink to='/'>Exit</BankOptionLink>
      <GameOverWrapper>
        <GameOverRow>
          <GameOverBox>
            <GameOverWinner>Congratulations {sortedPlayers[0].name}!</GameOverWinner>
          </GameOverBox>
        </GameOverRow>
        {sortedPlayers.map(x => {
          return (
            <GameOverRow>
              <GameOverBox>
                <GameOverText>{x.name}</GameOverText>
              </GameOverBox>
              <GameOverBox>
                <GameOverText>{x.score}</GameOverText>
              </GameOverBox>
            </GameOverRow>
          );
        })}
      </GameOverWrapper>
    </>
  );
}

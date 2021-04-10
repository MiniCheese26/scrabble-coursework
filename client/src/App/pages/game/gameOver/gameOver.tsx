import React from "react";
import {SharedPlayer} from "Types/sharedTypes";
import {GameOverBox, GameOverRow, GameOverText, GameOverWinner, GameOverWrapper} from "Styles/components/gameOver/styles";
import {BankOptionLink} from "Styles/index/styles";

type GameOverProps = {
  players: SharedPlayer[];
}

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
      <BankOptionLink to="/">Exit</BankOptionLink>
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

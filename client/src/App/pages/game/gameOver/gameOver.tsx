import React from "react";
import {SharedPlayer} from "Types/sharedTypes";

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
      {sortedPlayers.map(x => <p>{x.score}</p>)}
    </>
  );
}

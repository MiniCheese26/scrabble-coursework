import React from "react"
import {ScoresWrapper} from "Styles/components/scores/styles";
import {SharedPlayer} from "Types/sharedTypes";
import ScoreRow from "Components/scoreRow";

type scoresProps = {
  players: SharedPlayer[]
}

export default function Scores(props: scoresProps) {
  return (
    <ScoresWrapper>
      <ScoreRow name={"Player"} score={"Score"}/>
      {props.players.map(x => <ScoreRow score={x.score} name={x.name} key={x.playerId}/>)}
    </ScoresWrapper>
  );
}



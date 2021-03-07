import React from "react";
import {LeftScoreItemWrapper, ScoreRowWrapper, ScoreItem as ScoreItemStyle, ScoreItemWrapper} from "Styles/components/scoreItem/styles";

export type ScoreItemProps = {
  name: string,
  score: number | string
}

export default function ScoreRow(props: ScoreItemProps) {
  return (
    <ScoreRowWrapper>
      <LeftScoreItemWrapper>
        <ScoreItemStyle>{props.name}</ScoreItemStyle>
      </LeftScoreItemWrapper>
      <ScoreItemWrapper>
        <ScoreItemStyle>{props.score}</ScoreItemStyle>
      </ScoreItemWrapper>
    </ScoreRowWrapper>
  );
}
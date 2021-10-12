import React from 'react';
import {ScoreItemProps} from 'Types/props';
import styled from 'styled-components';

const ScoreRowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  border: 1px solid black;
  background: white;
  color: black;
  flex: 1;
`;

const ScoreItem = styled.p`
  flex: 1;
  align-self: center;
  padding-left: 0.3rem;
`;

const ScoreItemWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const LeftScoreItemWrapper = styled(ScoreItemWrapper)`
  border-right: 1px solid black;
`;

export default function ScoreRow(props: ScoreItemProps) {
  return (
    <ScoreRowWrapper>
      <LeftScoreItemWrapper>
        <ScoreItem>{props.name}</ScoreItem>
      </LeftScoreItemWrapper>
      <ScoreItemWrapper>
        <ScoreItem>{props.score}</ScoreItem>
      </ScoreItemWrapper>
    </ScoreRowWrapper>
  );
}

import styled from "styled-components";

export const ScoreRowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  border: 1px solid black;
  background: white;
  color: black;
  flex: 1;
`;

export const ScoreItem = styled.p`
  flex: 1;
  align-self: center;
  padding-left: 0.3rem;
`;

export const ScoreItemWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const LeftScoreItemWrapper = styled(ScoreItemWrapper)`
  border-right: 1px solid black;
`;
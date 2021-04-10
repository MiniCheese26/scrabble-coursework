import styled from "styled-components";

export const GameOverWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  background: white;
  margin: auto;
`;

export const GameOverRowWrapper = styled.div`
  flex: 1;
  display: flex;
  
  
`

export const GameOverRow = styled.div`
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

export const GameOverBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;

  &:first-child:not(:only-child) {
    border-right: 1px solid black;
  }
`;

export const GameOverText = styled.p`
  font-size: 18px;
`;

export const GameOverWinner = styled.p`
  font-size: 22px;
`;

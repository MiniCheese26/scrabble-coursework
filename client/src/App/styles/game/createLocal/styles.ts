import styled from "styled-components";
import {GameButton} from "Styles/globalStyles";

export const SingleplayerCreation = styled.div`
  background: black;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr) 0.1fr;
  grid-template-areas: 
          "player1 player1 player2 player2"
          "player3 player3 player4 player4"
          ". . . start";
  max-width: 40rem;
`;

export const PlayerWrapper = styled.div<{gridArea: string}>`
  color: black;
  background: white;
  border-radius: 5px;
  min-width: 4rem;
  min-height: 6rem;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  grid-area: ${props => props.gridArea};
`;

export const StartGame = styled.div`
  ${GameButton};
  background: white;
  color: black;
  font-size: 16px;
  padding: 0.5rem;
  border-radius: 5px;
  grid-area: start;
  max-height: 50px;
  margin-right: 0.5rem;
  align-self: center;
  cursor: pointer;

  &:hover {
    background: #888a88;
  }
`;
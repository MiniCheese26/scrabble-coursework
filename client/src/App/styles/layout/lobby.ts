import styled from 'styled-components';
import {GameButtonCss} from 'Styles/globalStyles';

export const LobbyBox = styled.div`
  background: black;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr) 0.1fr;
  grid-template-areas: 
          'player1 player1 player2 player2'
          'player3 player3 player4 player4'
          '. . . start';
  max-width: 40rem;
`;

export const OnlineLobbyBox = styled(LobbyBox)`
  background: black;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 0.1fr repeat(2, 1fr) 0.1fr;
  grid-template-areas:
          'id id password password'
          'player1 player1 player2 player2'
          'player3 player3 player4 player4'
          '. . . start';
  max-width: 40rem;
`;

export const StartGame = styled.div`
  ${GameButtonCss};
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

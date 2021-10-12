import styled from 'styled-components';
import humanImage from 'Resources/blank-avatar.png';
import aiImage from 'Resources/robotics.png';
import {Tick} from '@styled-icons/typicons/Tick';
import { InputOption } from './inputOption';

export const AddedPlayerWrapperRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const AddedPlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const LocalEmptyPlayerWrapper = styled.div`
  display: grid;
  grid-template: auto / repeat(2, 1fr);
  grid-template-areas: 'player ai';
  place-items: center;
  width: 100%;
  height: 100%;
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

export const PlayerDetailsWrapper = styled.div`
  flex: 2;
  border: black solid 2px;
  display: flex;
  min-width: 0;
  max-width: 100%;
  border-bottom-left-radius: 17px;
  border-top-left-radius: 17px;
`;

export const PlayerImage = styled.div`
  background-image: url(${humanImage});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-origin: content-box;
  max-width: 32px;
  min-height: 32px;
  flex: 2;
  padding: 0.1rem;
  border-right: black 2px solid;
`;

export const AiImage = styled(PlayerImage)`
  background-image: url(${aiImage});
`;

export const PlayerName = styled(InputOption)`
  border: none;
  font-weight: 500;
  font-size: 18px;
  margin: 0 0 0 0.3rem;
  padding: 0;
  text-transform: none;
  text-align: left;
  min-width: 0;
  max-width: 100%;
  flex: 2;
`;

export const TickBox = styled(Tick)`
  flex: 1;
  background-color: white;
  color: #059862;
  width: 0;
  height: 32px;
  margin-left: 0.5rem;
  border-left: black 2px solid;
  
  &:hover {
    cursor: pointer;
    background-color: #059862;
    color: white;
  }
`;

export const RemovePlayer = styled.button`
  background: white;
  padding: 0.1rem 0.6rem;
  border: 1px black solid;
  border-radius: 3px;
  text-align: center;
  max-width: 20%;
  margin-left: auto;
  flex: 1;
  
  &:hover {
    background: #FF3336;
    color: white;
  }
`;

export const AddOption = styled.button`
  border-radius: 5px;
  border: 1px solid black;
  padding: 0.5rem;
  font-size: 18px;
  background: white;
  
  &:hover {
    background: black;
    color: white;
  }
`;

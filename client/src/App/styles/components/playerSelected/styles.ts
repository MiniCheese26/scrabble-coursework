import styled from "styled-components";
import humanImage from "Resources/blank-avatar.png";
import aiImage from "Resources/robotics.png";
import {InputOption} from "Styles/game/styles";

export const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr 0.3fr / repeat(2, auto);
  grid-template-areas: 
          "picture name"
          ". delete";
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const PlayerImage = styled.div`
  background-image: url(${humanImage});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 32px;
  height: 32px;
  margin: 0;
  grid-area: picture;
`;

export const AiImage = styled(PlayerImage)`
  background-image: url(${aiImage});
`;

export const PlayerName = styled(InputOption)`
  border: none;
  border-bottom: black 2px solid;
  font-weight: 500;
  font-size: 18px;
  margin: 0 0 0 0.3rem;
  padding: 0;
  text-transform: none;
  text-align: left;
  grid-area: name;
  min-width: 0;
  max-width: 100%;
`;

export const PlayerRemove = styled.button`
  background: white;
  padding: 0.1rem 0.6rem;
  border: 1px black solid;
  border-radius: 3px;
  grid-area: delete;
  justify-self: end;
  text-align: center;
  width: 35px;

  &:hover {
    background: #FF3336;
  }
`;


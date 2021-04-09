import styled from "styled-components";
import {GameButton} from "Styles/globalStyles";
import {InputOption} from "Styles/game/styles";

export const WordCheckWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.3rem;
  border-bottom: #162127 2px solid;
  margin-top: 0.3rem;
`;

export const WordCheckInput = styled(InputOption)`
  max-width: unset;
  width: 100%;
  max-height: 70px;
  margin-bottom: unset;
`;

export const WordCheckSubmit = styled.button<{backgroundColour: string, foregroundColour: string}>`
  ${GameButton};
  flex: 1;
  max-height: 70px;
  margin-top: auto;
  background-color: ${props => props.backgroundColour};
  color: ${props => props.foregroundColour};
`;

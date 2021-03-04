import styled from "styled-components";
import {Link} from "react-router-dom";
import {GameButton} from "Styles/globalStyles";

export const GameOption = styled(Link)`
  ${GameButton};
`;

export const InputOption = styled.input`
  font-weight: 700;
  flex: 2;
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 32px;
  border: 3px black solid;
  text-align: center;
  max-width: 70%;
  text-transform: uppercase;
  align-self: center;
`;
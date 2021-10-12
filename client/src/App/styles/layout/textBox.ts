import styled from 'styled-components';
import {GameButton} from 'Styles/globalStyles';

export const TextBox = styled.div`
  background: black;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextBoxHeader = styled.h4`
  font-size: 20px;
`;

export const TextBoxContent = styled.p`
  margin-bottom: 1rem;
`;

export const TextBoxButtonRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-evenly;
  width: 100%;
`;

export const TextBoxButton = styled(GameButton)`
  background: white;
  color: black;
  padding: 0.9rem 1.4rem;
  
  &:hover {
    background: #888a88;
    cursor: pointer;
  }
`;

import styled from 'styled-components';

export const InfoBoxWrapper = styled.div<{gridArea: string}>`
  background: white;
  color: black;
  border-radius: 5px;
  grid-area: ${props => props.gridArea};
  display: flex;
  max-height: 30px;
  margin: 0 0.5rem;
  
  &:hover {
    cursor: pointer;
  }
`;

export const InfoBoxName = styled.p`
  flex: 1;
  border-right: solid black 1px;
  padding: 0.1rem;
  margin: auto;
  text-align: center;
`;

export const InfoBoxText = styled.p`
  flex: 3;
  margin: auto;
  padding: 0.1rem 0.1rem 0.1rem 0.5rem;
`;

import styled from "styled-components";

const GridItemElementBase = styled.div`
  text-align: center;
  border: 1px solid black;
  place-items: center;
  padding: 0.2rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

export const FreeGridItemElement = styled(GridItemElementBase)<{backgroundColour: string, textColour: string}>`
  background: ${props => props.backgroundColour};
  color: ${props => props.textColour};
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
          ". topText ."
          ". bottomText .";
`;

export const UsedGridItemElement = styled(GridItemElementBase)`
  background: #FFF;
  color: black;
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
          ". . ."
          ". letter ."
          ". . value";
`;

export const GridText = styled.p<{gridArea: string, fontSize?: number}>`
  grid-area: ${props => props.gridArea};
  font-size: ${props => props.fontSize || 1.0};
`;
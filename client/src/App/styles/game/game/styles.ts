import styled from "styled-components";

export const GameWrapper = styled.div`
  display: grid;
  grid-template: repeat(15, 1fr) / repeat(15, 1fr);
  justify-items: stretch;
  width: 100%;
  height: 100%;
`;
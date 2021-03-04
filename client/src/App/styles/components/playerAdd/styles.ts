import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template: auto / repeat(2, 1fr);
  grid-template-areas: "player ai";
  place-items: center;
  width: 100%;
  height: 100%;
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
import styled from "styled-components";

export const Header = styled.header`
  flex: 1;
  display: flex;
  background-color: #DB5461;
  align-items: stretch;
  margin-bottom: 0.5rem;
`;

const HeaderItem = styled.div`
  flex: 1;
`;

const HeaderEdgeItem = styled(HeaderItem)`
  align-items: center;
  display: flex;
`;

export const HeaderMenuOuter = styled(HeaderEdgeItem)`
  border-right: 0.5rem solid #FAFAFA;
  
  & h1 {
    padding-left: 1rem;
  }
`;

export const HeaderCreditsOuter = styled(HeaderEdgeItem)`
  justify-content: flex-end;
  border-left: 0.5rem solid #FAFAFA;
  
  & h1 {
    padding-right: 1rem;
  }
`;

export const HeaderTitle = styled(HeaderItem)`
  font-weight: 300;
  flex-grow: 6;
  text-align: center;

  & a {
    font-size: 5rem;
    text-decoration: none;
    color: black;
  }

  & h4 {
    font-size: 1.8rem;
    padding-bottom: 0.7rem;
  }
`;


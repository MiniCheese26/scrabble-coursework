import styled, {css} from "styled-components";
import {GameButton} from "Styles/globalStyles";
import {Link} from "react-router-dom";

export const Container = styled.section`
  flex: 7;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  height: 100%;
  color: #4E4D5C;
  min-height: 500px;
  min-width: 860px;
`;

export const Panel = styled.section`
  background: #2D4654;
  color: #FFF;
  padding: 0.8rem;
  border-radius: 15px;
`;

export const MainSection = styled(Panel)`
  flex: 4 1 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.5rem;
  max-width: 75%;

  & a:not(:last-child) {
    margin-bottom: 1rem;
  }
  
  @media (min-width: 992px) {
    max-width: 80%;
  }
`;

export const AnimatedDivWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const BackOptionCss = css`
  ${GameButton};
  align-self: flex-start;
  flex: 0 1;
  padding: 1rem;
`

export const BackOption = styled.button`
  ${BackOptionCss}
`;

export const BankOptionLink = styled(Link)`
  ${BackOptionCss}
`;

export const RightSection = styled(Panel)`
  flex: 1 2 20%;
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
`;

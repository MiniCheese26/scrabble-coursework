import styled, {css} from 'styled-components';

export const GameButtonCss = css`
  font-weight: 500;
  padding: 1.5rem;
  font-size: 1.4rem;
  word-break: break-word;
  background: black;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
`;

export const GameButton = styled.div`
  ${GameButtonCss}
  `;

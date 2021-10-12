import styled, {css} from 'styled-components';
import {GameButtonCss} from 'Styles/globalStyles';
import {Link} from 'react-router-dom';

export const BackOptionCss = css`
  ${GameButtonCss};
  align-self: flex-start;
  flex: 0 1;
  padding: 1rem;
`;

export const BackOption = styled.button`
  ${BackOptionCss}
`;

export const BankOptionLink = styled(Link)`
  ${BackOptionCss}
`;

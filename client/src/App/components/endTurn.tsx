import React from 'react';
import {SocketOperationProps} from 'Types/props';
import styled from 'styled-components';
import {GameButtonCss} from 'Styles/globalStyles';

const EndTurnButton = styled.button`
  ${GameButtonCss};
  margin-top: 0.3rem;
  flex: 1;
  width: 100%;
  max-height: 70px;
`;

export default function EndTurn(props: SocketOperationProps) {
  return (
    <EndTurnButton onClick={() => props.socketOperations.current.endTurn()}>End Turn</EndTurnButton>
  );
}

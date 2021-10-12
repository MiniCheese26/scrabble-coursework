import React from 'react';
import useWebsocketEvent from 'Hooks/useWebsocketEvent';
import {StateChangeEmitterProps} from 'Types/props';
import styled from 'styled-components';

const ErrorsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-bottom: #162127 2px solid;
  align-items: center;
`;

export const ErrorsTitle = styled.p`
  font-size: 22px;
`;

export default function Errors(props: StateChangeEmitterProps) {
  const errors = useWebsocketEvent<string[]>(props.localStateChangeEmitter.current.activeErrorsUpdated, []);

  return (
    <ErrorsWrapper>
      <ErrorsTitle>Errors:</ErrorsTitle>
      {errors!.map(x => <p>{x.toTitleCase()}</p>)}
    </ErrorsWrapper>
  );
}

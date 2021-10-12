import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import {GameButtonCss} from 'Styles/globalStyles';
import {InputOption} from 'Styles/layout/inputOption';

const WordCheckWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.3rem;
  border-bottom: #162127 2px solid;
  margin-top: 0.3rem;
`;

const WordCheckInput = styled(InputOption)`
  max-width: unset;
  width: 100%;
  max-height: 70px;
  margin-bottom: unset;
`;

const WordCheckSubmit = styled.button<{backgroundColour: string, foregroundColour: string}>`
  ${GameButtonCss};
  flex: 1;
  max-height: 70px;
  margin-top: auto;
  background-color: ${props => props.backgroundColour};
  color: ${props => props.foregroundColour};
`;

const DICTIONARY_URL = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/';

export default function WordCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [submitText, setSubmitText] = useState('Check Word');
  const [submitBackgroundColour, setSubmitBackgroundColour] = useState('black');
  const [submitForegroundColour, setSubmitForegroundColour] = useState('white');
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  const onCheckWord = async () => {
    if (inputRef.current && !isChecking) {
      setIsChecking(true);

      if (currentTimeout) {
        clearTimeout(currentTimeout);
        setCurrentTimeout(undefined);
      }

      const word = inputRef.current?.value;

      if (word) {
        setSubmitText('Checking word...');
        const checkResult = await fetch(DICTIONARY_URL + word);

        if (checkResult.ok) {
          setSubmitText('Word is valid');
          setSubmitBackgroundColour('#64b450');
        } else {
          setSubmitText('Word is invalid');
          setSubmitBackgroundColour('#ED4545');
          setSubmitForegroundColour('black');
        }

        const timeoutId = setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.value = '';
          }

          setSubmitText('Check Word');
          setSubmitBackgroundColour('black');
          setSubmitForegroundColour('white');
          setCurrentTimeout(undefined);
        }, 2000);

        setCurrentTimeout(timeoutId);
      }

      setIsChecking(false);
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await onCheckWord();
    }
  };

  return (
    <WordCheckWrapper>
      <WordCheckInput ref={inputRef} placeholder={'Enter word...'} onKeyDown={async (e: React.KeyboardEvent) => {
        await onKeyDown(e);
      }}/>
      <WordCheckSubmit backgroundColour={submitBackgroundColour} foregroundColour={submitForegroundColour}
                       onClick={async () => {
                         await onCheckWord();
                       }}>{submitText}</WordCheckSubmit>
    </WordCheckWrapper>
  );
}

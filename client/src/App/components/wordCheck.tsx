import React, {useRef, useState} from "react";
import {WordCheckInput, WordCheckSubmit, WordCheckWrapper } from "Styles/components/wordCheck/styles";

const DICTIONARY_URL = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/';

export default function WordCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [submitText, setSubmitText] = useState("Check Word");
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onCheckWord = async () => {
    if (inputRef.current && !isChecking) {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        setCurrentTimeout(null);
      }

      setIsChecking(true);
      setSubmitText("Checking word...");
      const word = inputRef.current?.value;

      if (word) {
        const checkResult = await fetch(DICTIONARY_URL + word);

        if (checkResult.ok) {
          setSubmitText("Word is valid");
        } else {
          setSubmitText("Word is invalid");
        }

        const timeoutId = setTimeout(() => {
          setSubmitText("Check Word");
          setCurrentTimeout(null);
        }, 2000);

        setCurrentTimeout(timeoutId);
      }

      setIsChecking(false);
    }
  };

  return (
    <WordCheckWrapper>
      <WordCheckInput ref={inputRef} placeholder={"Enter word..."}/>
      <WordCheckSubmit onClick={async () => {await onCheckWord();}}>{submitText}</WordCheckSubmit>
    </WordCheckWrapper>
  );
}
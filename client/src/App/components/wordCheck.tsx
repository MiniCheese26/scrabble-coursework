import React, {useRef, useState} from "react";
import {WordCheckInput, WordCheckSubmit, WordCheckWrapper} from "Styles/components/wordCheck/styles";

const DICTIONARY_URL = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/';

export default function WordCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [submitText, setSubmitText] = useState("Check Word");
  const [submitBackgroundColour, setSubmitBackgroundColour] = useState("black");
  const [submitForegroundColour, setSubmitForegroundColour] = useState("white");
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onCheckWord = async () => {
    if (inputRef.current && !isChecking) {
      setIsChecking(true);

      if (currentTimeout) {
        clearTimeout(currentTimeout);
        setCurrentTimeout(null);
      }

      const word = inputRef.current?.value;

      if (word) {
        setSubmitText("Checking word...");
        const checkResult = await fetch(DICTIONARY_URL + word);

        if (checkResult.ok) {
          setSubmitText("Word is valid");
          setSubmitBackgroundColour("#64b450");
        } else {
          setSubmitText("Word is invalid");
          setSubmitBackgroundColour("#ED4545");
          setSubmitForegroundColour("black");
        }

        const timeoutId = setTimeout(() => {
          setSubmitText("Check Word");
          setSubmitBackgroundColour("black");
          setSubmitForegroundColour("white");
          setCurrentTimeout(null);
        }, 2000);

        setCurrentTimeout(timeoutId);
      }

      setIsChecking(false);
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await onCheckWord();
    }
  }

  return (
    <WordCheckWrapper>
      <WordCheckInput ref={inputRef} placeholder={"Enter word..."} onKeyDown={async (e: React.KeyboardEvent) => {
        await onKeyDown(e)
      }}/>
      <WordCheckSubmit backgroundColour={submitBackgroundColour} foregroundColour={submitForegroundColour}
                       onClick={async () => {
                         await onCheckWord();
                       }}>{submitText}</WordCheckSubmit>
    </WordCheckWrapper>
  );
}

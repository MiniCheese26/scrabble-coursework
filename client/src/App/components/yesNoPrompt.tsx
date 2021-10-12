import {TextBox, TextBoxButton, TextBoxButtonRow, TextBoxContent} from 'Styles/layout/textBox';
import React from 'react';
import {YesNoPromptProps} from 'Types/props';

export function YesNoPrompt(props: YesNoPromptProps) {
  return (
    <TextBox>
      <TextBoxContent>{props.question}</TextBoxContent>
      <TextBoxButtonRow>
        <TextBoxButton onClick={() => props.onYes()}>Yes</TextBoxButton>
        <TextBoxButton onClick={() => props.onNo()}>No</TextBoxButton>
      </TextBoxButtonRow>
    </TextBox>
  );
}

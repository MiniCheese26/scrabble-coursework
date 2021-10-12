import React from 'react';
import {UiButton} from 'Styles/layout/uiButton';

export default function Create(): JSX.Element {
  return (
    <>
      <UiButton to='/createOnline'>Create Online Game</UiButton>
      <UiButton to='/createLocal'>Create Local Game</UiButton>
    </>
  );
}

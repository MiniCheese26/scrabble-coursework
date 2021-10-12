import React from 'react';
import { UiButton } from 'Styles/layout/uiButton';

export default function Choosing(): JSX.Element {
    return (
        <>
            <UiButton to='/create'>Create Game</UiButton>
            <UiButton to='/join'>Join Game</UiButton>
        </>
    );
}

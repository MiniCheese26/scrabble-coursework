import React from "react";
import { CurrentPlayerAreaWrapper, CurrentPlayer as CurrentPlayerStyle } from "Styles/components/currentPlayer/styles";

type CurrentPlayerProps = {
    currentPlayer: string
}

export default function CurrentPlayer(props: CurrentPlayerProps) {
    return (
        <CurrentPlayerAreaWrapper>
            <CurrentPlayerStyle>Current Player: {props.currentPlayer}</CurrentPlayerStyle>
        </CurrentPlayerAreaWrapper>
    );
}
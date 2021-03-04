import React from "react";
import {GameOption} from "Styles/game/styles";

export default function Choosing(): JSX.Element {
    return (
        <>
            <GameOption to="/create">Create Game</GameOption>
            <GameOption to="/join">Join Game</GameOption>
        </>
    );
}

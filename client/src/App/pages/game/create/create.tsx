import React from "react";
import {GameOption} from "Styles/game/styles";

export default function Create(): JSX.Element {
    return (
        <>
            <GameOption to="/createOnline">Create Online Game</GameOption>
            <GameOption to="/createLocal">Create Local Game</GameOption>
        </>
    );
}

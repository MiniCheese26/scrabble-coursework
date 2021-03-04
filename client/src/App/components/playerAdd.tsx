import {PlayerSelectedProps} from "Types/playerSelected";
import {AddOption, Wrapper} from "Styles/components/playerAdd/styles";
import React from "react";

export default function PlayerAdd(props: PlayerSelectedProps): JSX.Element {
    return (
        <Wrapper>
            <AddOption onClick={() => props.handlePlayers("Human", props.index)}>Player</AddOption>
            <AddOption onClick={() => props.handlePlayers("Ai", props.index)}>AI</AddOption>
        </Wrapper>
    );
}
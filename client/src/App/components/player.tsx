import PlayerAdd from "./playerAdd";
import PlayerSelected from "./playerSelected";
import React from "react";
import {PlayerSelectedProps} from "Types/playerSelected";

export default function Player(props: PlayerSelectedProps): JSX.Element {
    const player = props.players[props.index];

    if (player.type === "Empty") {
        return <PlayerAdd players={props.players} index={props.index} handlePlayers={props.handlePlayers} handleInput={props.handleInput}/>
    } else if (player.type === "Ignore") {
        return <></>;
    } else {
        return <PlayerSelected players={props.players} index={props.index} handlePlayers={props.handlePlayers} handleInput={props.handleInput}/>
    }
}
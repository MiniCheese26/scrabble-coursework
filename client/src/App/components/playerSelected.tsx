import {AiImage, PlayerImage, PlayerName, PlayerRemove, Wrapper} from "Styles/components/playerSelected/styles";
import * as React from "react";
import {ChangeEvent} from "react";
import {PlayerSelectedProps} from "Types/playerSelected";
import {LocalPlayer} from "Types/sharedTypes";

export default function PlayerSelected(props: PlayerSelectedProps): JSX.Element {
    const player: LocalPlayer = props.players[props.index];

    const image = player.type === "Human" ? <PlayerImage/> : <AiImage/>;

    const name = player.type === "Human"
        ? <PlayerName defaultValue={player.name} placeholder="Player Name" maxLength={12} onChange={(e: ChangeEvent<HTMLInputElement>) => props.handleInput(e, props.index)}/>
        : <PlayerName value={player.name} readOnly={true}/>;

    return (
        <Wrapper>
            {image}
            {name}
            <PlayerRemove onClick={() => props.handlePlayers("Empty", props.index)}>X</PlayerRemove>
        </Wrapper>
    );
}
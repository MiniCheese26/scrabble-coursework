import {LocalPlayer} from "./createLocal";
import {ChangeEvent} from "react";
import {GameStatePlayerType} from "Types/sharedTypes";

export type PlayerSelectedProps = {
    players: LocalPlayer[],
    index: number,
    handlePlayers(newType: GameStatePlayerType, index: number): void,
    handleInput(e: ChangeEvent<HTMLInputElement>, index: number): void
};
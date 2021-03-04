import {LocalPlayer} from "./createLocal";
import {ChangeEvent} from "react";
import {GamePlayerType} from "Types/sharedTypes";

export type PlayerSelectedProps = {
    players: LocalPlayer[],
    index: number,
    handlePlayers(newType: GamePlayerType, index: number): void,
    handleInput(e: ChangeEvent<HTMLInputElement>, index: number): void
};
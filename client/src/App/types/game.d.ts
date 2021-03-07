import {LocalPlayer} from "Types/createLocal";
import {CurrentGame, GameOperations} from "Types/index";
import {GameGridElement, SharedPlayer} from "Types/sharedTypes";

export type GameProps = {
    grid: GameGridElement[],
    players: SharedPlayer[],
    currentGame: CurrentGame,
    socketOperations: GameOperations
};
import {LocalPlayer} from "Types/createLocal";
import {CurrentGame, GameOperations} from "Types/index";
import {GameGridElement, GameGridItem, SharedPlayer} from "Types/sharedTypes";

export type GameProps = {
    grid: GameGridElement<GameGridItem>[],
    players: SharedPlayer[],
    currentGame: CurrentGame,
    socketOperations: GameOperations
};
import {TileBase} from "Classes/tiles";
import {LocalPlayer} from "Types/createLocal";
import {CurrentGame, GameOperations} from "Types/index";

export type Coordinate = {
    x: number,
    y: number
};

type SpecialCoordinate = {
    [key: number]: TileBase
};

export type SpecialCoordinates = {
    [key: number]: SpecialCoordinate
};

export type GameProps = {
    grid: any,
    players: any[],
    currentGame: CurrentGame,
    socketOperations: GameOperations
};
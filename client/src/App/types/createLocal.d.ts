import {LocalPlayer} from "Types/sharedTypes";

export type CreateLocalProps = {
    createLocalGame(players: LocalPlayer[]): void
};
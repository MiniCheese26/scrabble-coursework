import { GameOperations } from 'Types/index';
import {GameGridItem} from "Types/sharedTypes";

export type GridItemProps = {
    gridItem: GameGridItem,
    index: number,
    gameOperations: GameOperations
};

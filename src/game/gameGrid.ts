import {ParsedGameGrid} from '@Types/gamestate';
import {GameStateHelpers} from './gameStateHelpers';
import {GameGridElement, GameGridItem} from '@Types/sharedTypes';

export class GameGrid {
  grid: GameGridElement<GameGridItem>[]

  constructor() {
    this.grid = [];
  }

  parseGrid() {
    const parsedGrid: ParsedGameGrid = {
      rows: {},
      columns: {},
    };

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const index = GameStateHelpers.XYToIndex({y, x});
        const gridElement = this.grid[index];

        if (parsedGrid.rows[y] === undefined) {
          parsedGrid.rows[y] = [];
        }

        if (parsedGrid.columns[x] === undefined) {
          parsedGrid.columns[x] = [];
        }

        parsedGrid.rows[y].push(gridElement);
        parsedGrid.columns[x].push(gridElement);
      }
    }

    return parsedGrid;
  }
}

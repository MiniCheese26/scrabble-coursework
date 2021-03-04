import {GameGridElement, ParsedGameGrid} from "../types/gamestate";
import {GameStateHelpers} from "./gameStateHelpers";

export class GameGrid {
  grid: GameGridElement[]

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
        const gridIndex = this.grid[index];

        if (parsedGrid.rows[y] === undefined) {
          parsedGrid.rows[y] = [];
        }

        if (parsedGrid.columns[x] === undefined) {
          parsedGrid.columns[x] = [];
        }

        parsedGrid.rows[y].push(gridIndex);
        parsedGrid.columns[x].push(gridIndex);
      }
    }

    return parsedGrid;
  }
}
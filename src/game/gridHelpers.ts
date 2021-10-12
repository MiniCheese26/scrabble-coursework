import {Coordinate} from '@Types/sharedTypes';

export class gridHelpers {
  static indexToXY(index: number): Coordinate {
    const y = Math.floor(index / 15);
    const x = index - (y * 15);

    return {
      x,
      y,
    };
  }

  static mirrorCoordinates(x: number, y: number) {
    const mirroredCoordinates: Coordinate[] = [
      {
        x,
        y,
      },
      {
        x: 14 - x,
        y,
      },
      {
        x,
        y: 14 - y,
      },
      {
        x: 14 - y,
        y: 14 - x,
      },
    ];


    mirroredCoordinates.sort((a, b) => {
      if (a.x + a.y < b.x + b.y) {
        return -1;
      } else if (a.x + a.y > b.x + b.y) {
        return 1;
      } else {
        return 0;
      }
    });

    return mirroredCoordinates;
  }
}

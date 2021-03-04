export class CurrentPlayer {
  index: number;
  lastIndex: number;

  constructor(index: number, lastIndex: number) {
    this.index = index;
    this.lastIndex = lastIndex;
  }

  nextPlayer() {
    if (this.index + 1 > this.lastIndex) {
      this.index = 0;
    } else {
      this.index++;
    }
  }
}
import 'phaser';

export class Grid {
  constructor(cells) {
    this.cells = cells;
    this.height = cells.length;
    this.width = cells[0].length;
  }

  get(row, col) {
    return this.cells[row][col];
  }

  some(fn) {
    return this.cells.some(row => row.some(fn));
  }

  getNeighbors(row, col) {
    // return [
      // (row > 0 && row < this.height) && this.cells[row - 1][col],
      // (row >= 0 && row < this.height - 1) && this.cells[row + 1][col],
      // (col > 0 && col < this.width) && this.cells[row][col - 1],
      // (col >+ 0 && col < this.width - 1) && this.cells[row][col + 1],
    // ].filter(c => c);
    const cell = this.get(row, col);
    const above = Phaser.Math.Clamp(row - 1, 0, this.height - 1);
    const below = Phaser.Math.Clamp(row + 1, 0, this.height - 1);
    const left = Phaser.Math.Clamp(col - 1, 0, this.width - 1);
    const right = Phaser.Math.Clamp(col + 1, 0, this.width - 1);

    const neighbors = [
      this.get(above, col),
      this.get(below, col),
      this.get(row, left),
      this.get(row, right),
    ].filter(neighbor => neighbor != cell);

    return neighbors;
  }
}

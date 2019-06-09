import 'phaser';

import { Cell } from './cell';

export class Grid {
  constructor(scene, rows, cols, cellSize) {
    this.cells = [];

    for (let r = 0; r < rows; r++) {
      this.cells[r] = [];
      for (let c = 0; c < cols; c++) {
        this.cells[r][c] = new Cell(scene, c * cellSize + 100, r * cellSize + 100, cellSize);
        this.cells[r][c].row = r;
        this.cells[r][c].col = c;
        this.cells[r][c].visited = false;
      }
    }

    this.height = this.cells.length;
    this.width = this.cells[0].length;
  }

  get(row, col) {
    return this.cells[row][col];
  }

  some(fn) {
    return this.cells.some(row => row.some(fn));
  }

  getNeighbors(row, col) {
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

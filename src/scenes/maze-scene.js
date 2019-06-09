import 'phaser'
import { Grid } from '../grid';

export class MazeScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(0xcacaca);

    this.ROWS = 10;
    this.COLS = 10;
    const size = 40;

    this.grid = new Grid(this, this.ROWS, this.COLS, size);

    this.generateMaze();
  }

  generateMaze() {
    const TIME_STEP = 50;
    let destroyedWallCount = 0;

    let currentRow = 0;
    let currentCol = 0;
    const cellStack = [];
    this.grid.get(currentRow, currentCol).visited = true;

    this.grid.get(currentRow, currentCol).removeTopWall();
    this.grid.get(this.ROWS - 1, this.COLS - 1).removeBottomWall();

    while (this.grid.some(cell => !cell.visited)) {
      const cell = this.grid.get(currentRow, currentCol);
      const neighbors = this.grid.getNeighbors(currentRow, currentCol);
      const unvisitedNeighbors = neighbors.filter(neighbor => !neighbor.visited);

      if (unvisitedNeighbors.length) {
        const neighbor = Phaser.Math.RND.pick(unvisitedNeighbors);
        cellStack.push(cell);

        if (cell.row == neighbor.row) {
          if (neighbor.col < cell.col) { // left
            this.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeRightWall();
              cell.removeLeftWall();
            });
            destroyedWallCount += 1;
          } else { // right
            this.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeLeftWall();
              cell.removeRightWall();
            });
            destroyedWallCount += 1;
          }
        } else {
          if (neighbor.row < cell.row) { // above
            this.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeBottomWall();
              cell.removeTopWall();
            });
            destroyedWallCount += 1;
          } else { // below
            this.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeTopWall();
              cell.removeBottomWall();
            });
            destroyedWallCount += 1;
          }
        }

        currentRow = neighbor.row;
        currentCol = neighbor.col;

        neighbor.visited = true;
      } else if (cellStack.length) {
        const poppedCell = cellStack.pop();
        currentRow = poppedCell.row;
        currentCol = poppedCell.col;
      }
    }
  }
}

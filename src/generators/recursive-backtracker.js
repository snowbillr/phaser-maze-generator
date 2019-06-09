export class RecursiveBacktracker {
  constructor(scene, grid) {
    this.scene = scene;
    this.grid = grid;
  }

  generate() {
    const TIME_STEP = 50;
    let destroyedWallCount = 0;

    let currentRow = 0;
    let currentCol = 0;
    const cellStack = [];
    this.grid.get(currentRow, currentCol).visited = true;

    this.grid.get(currentRow, currentCol).removeTopWall();
    this.grid.get(this.grid.height - 1, this.grid.width - 1).removeBottomWall();

    while (this.grid.some(cell => !cell.visited)) {
      const cell = this.grid.get(currentRow, currentCol);
      const neighbors = this.grid.getNeighbors(currentRow, currentCol);
      const unvisitedNeighbors = neighbors.filter(neighbor => !neighbor.visited);

      if (unvisitedNeighbors.length) {
        const neighbor = Phaser.Math.RND.pick(unvisitedNeighbors);
        cellStack.push(cell);

        if (cell.row == neighbor.row) {
          if (neighbor.col < cell.col) { // left
            this.scene.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeRightWall();
              cell.removeLeftWall();
            });
            destroyedWallCount += 1;
          } else { // right
            this.scene.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeLeftWall();
              cell.removeRightWall();
            });
            destroyedWallCount += 1;
          }
        } else {
          if (neighbor.row < cell.row) { // above
            this.scene.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
              neighbor.removeBottomWall();
              cell.removeTopWall();
            });
            destroyedWallCount += 1;
          } else { // below
            this.scene.time.delayedCall(TIME_STEP * destroyedWallCount, () => {
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

  reset() {
    this.grid.forEach(cell => delete cell.visited);
  }
}

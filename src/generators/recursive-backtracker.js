export class RecursiveBacktracker {
  constructor(scene, grid) {
    this.scene = scene;
    this.grid = grid;
  }

  canStep() {
    return this.grid.some(cell => !cell.visited);
  }

  generate() {
    this.currentRow = 0;
    this.currentCol = 0;
    this.cellStack = [];

    this.destroyedWallCount = 0;

    this.grid.get(this.currentRow, this.currentCol).visited = true;

    this.grid.get(this.currentRow, this.currentCol).removeTopWall();
    this.grid.get(this.grid.height - 1, this.grid.width - 1).removeBottomWall();

    this.step();
  }

  step() {
    const TIME_STEP = 50;

    const cell = this.grid.get(this.currentRow, this.currentCol);
    const neighbors = this.grid.getNeighbors(this.currentRow, this.currentCol);
    const unvisitedNeighbors = neighbors.filter(neighbor => !neighbor.visited);

    if (unvisitedNeighbors.length) {
      const neighbor = Phaser.Math.RND.pick(unvisitedNeighbors);
      this.cellStack.push(cell);

      if (cell.row == neighbor.row) {
        if (neighbor.col < cell.col) { // left
          this.scene.time.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
            neighbor.removeRightWall();
            cell.removeLeftWall();
          });
          this.destroyedWallCount += 1;
        } else { // right
          this.scene.time.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
            neighbor.removeLeftWall();
            cell.removeRightWall();
          });
          this.destroyedWallCount += 1;
        }
      } else {
        if (neighbor.row < cell.row) { // above
          this.scene.time.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
            neighbor.removeBottomWall();
            cell.removeTopWall();
          });
          this.destroyedWallCount += 1;
        } else { // below
          this.scene.time.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
            neighbor.removeTopWall();
            cell.removeBottomWall();
          });
          this.destroyedWallCount += 1;
        }
      }

      this.currentRow = neighbor.row;
      this.currentCol = neighbor.col;

      neighbor.visited = true;
    } else if (this.cellStack.length) {
      const poppedCell = this.cellStack.pop();
      this.currentRow = poppedCell.row;
      this.currentCol = poppedCell.col;
    }

    if (this.canStep()) {
      this.step();
    }
  }


  reset() {
    this.grid.forEach(cell => delete cell.visited);
  }
}

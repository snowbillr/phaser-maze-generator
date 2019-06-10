import 'phaser';

export class RecursiveBacktracker {
  constructor(scene, grid, gridView) {
    this.scene = scene;
    this.grid = grid;
    this.gridView = gridView;

    this.scheduler = new Phaser.Time.Clock(scene);
    this.scheduler.start();

    this.reset();
  }

  reset() {
    this.currentRow = 0;
    this.currentCol = 0;
    this.cellStack = [];

    this.destroyedWallCount = 0;

    this.grid.forEachCell(cell => delete cell.visited);
    this.gridView.reset();

    this.scheduler.removeAllEvents();
  }

  generate() {
    this.reset();

    this.grid.get(this.currentRow, this.currentCol).visited = true;

    // this.grid.get(this.currentRow, this.currentCol).removeTopWall();
    // this.grid.get(this.grid.height - 1, this.grid.width - 1).removeBottomWall();

    this.step();
  }

  // private

  canStep() {
    return this.grid.someCell(cell => !cell.visited);
  }

  step() {
    const cell = this.grid.get(this.currentRow, this.currentCol);
    const neighbors = Object.values(this.grid.getNeighbors(cell)).filter(x => x);
    const unvisitedNeighbors = neighbors.filter(neighbor => !neighbor.visited);

    if (unvisitedNeighbors.length) {
      const neighbor = Phaser.Math.RND.pick(unvisitedNeighbors);
      this.cellStack.push(cell);

      this.scheduleNextWallRemoval(cell, neighbor);

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

  scheduleNextWallRemoval(cell1, cell2) {
    const TIME_STEP = 50;

    if (cell1.row == cell2.row) {
      if (cell2.col < cell1.col) { // left
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          // cell2.removeRightWall();
          // cell1.removeLeftWall();
          this.gridView.destroyWall(cell1.walls.left);
        });
      } else { // right
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          // cell2.removeLeftWall();
          // cell1.removeRightWall();
          this.gridView.destroyWall(cell1.walls.right);
        });
      }
    } else {
      if (cell2.row < cell1.row) { // above
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          // cell2.removeBottomWall();
          // cell1.removeTopWall();
          this.gridView.destroyWall(cell1.walls.above);
        });
      } else { // below
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          // cell2.removeTopWall();
          // cell1.removeBottomWall();
          this.gridView.destroyWall(cell1.walls.below);
        });
      }
    }

    this.destroyedWallCount += 1;
  }
}

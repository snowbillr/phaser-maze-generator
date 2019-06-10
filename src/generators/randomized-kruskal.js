import 'phaser';

export class RandomizedKruskal {
  constructor(scene, grid, gridView) {
    this.scene = scene;
    this.grid = grid;
    this.gridView = gridView;

    this.scheduler = new Phaser.Time.Clock(scene);
    this.scheduler.start();

    this.reset();
  }

  reset() {
    this.destroyedWallCount = 0;

    this.walls = Phaser.Math.RND.shuffle([...this.grid.walls]);
    this.cellSets = [];
    this.grid.forEachCell(cell => {
      this.cellSets.push(new Set([cell]));
    });
  }

  generate() {
    this.walls.forEach(wall => {
      const cell1Set = this._findCellSet(wall.cell1);
      const cell2Set = this._findCellSet(wall.cell2);

      if (cell1Set != cell2Set) {
        this._scheduleNextWallRemoval(wall.cell1, wall.cell2);

        const newCellSet = this._combineCellSets(cell1Set, cell2Set);
        this.cellSets.push(newCellSet);

        // remove old cell sets
        const cell1SetIndex = this.cellSets.findIndex(cellSet => cellSet == cell1Set);
        this.cellSets.splice(cell1SetIndex, 1);

        const cell2SetIndex = this.cellSets.findIndex(cellSet => cellSet == cell2Set);
        this.cellSets.splice(cell2SetIndex, 1);
      }
    });
  }

  _findCellSet(cell) {
    return this.cellSets.find(cellSet => {
      return cellSet.has(cell);
    });
  }

  _combineCellSets(set1, set2) {
    var _union = new Set(set1);
    for (var elem of set2) {
        _union.add(elem);
    }
    return _union;
  }

  _scheduleNextWallRemoval(cell1, cell2) {
    const TIME_STEP = 50;

    if (cell1.row == cell2.row) {
      if (cell2.col < cell1.col) { // left
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          this.gridView.destroyWall(cell1.walls.left);
        });
      } else { // right
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          this.gridView.destroyWall(cell1.walls.right);
        });
      }
    } else {
      if (cell2.row < cell1.row) { // above
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          this.gridView.destroyWall(cell1.walls.above);
        });
      } else { // below
        this.scheduler.delayedCall(TIME_STEP * this.destroyedWallCount, () => {
          this.gridView.destroyWall(cell1.walls.below);
        });
      }
    }

    this.destroyedWallCount += 1;
  }
}

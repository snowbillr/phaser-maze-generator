import 'phaser'
import { RecursiveBacktracker } from '../generators/recursive-backtracker';
import { GridView } from '../entities/grid-view';
import { Grid } from '../models/grid';
import { RandomizedKruskal } from '../generators/randomized-kruskal';

export class MazeScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(0xcacaca);

    this.scheduler = new Phaser.Time.Clock(this);
    this.scheduler.start();

    this.destroyedWallCount = 0;

    const rows = 5;
    const cols = 8;

    const grid = new Grid(rows, cols);
    this.gridView = new GridView(this, grid, 250, 250);

    this.generators = [
      {
        name: 'Recursive Backtracer',
        generator: new RecursiveBacktracker(this, grid, this.gridView),
      },
      {
        name: 'Randomized Kruskal',
        generator: new RandomizedKruskal(this, grid, this.gridView),
      },
    ];
    this.activeGeneratorIndex = 0;

    this.add.text(25, 450, 'switch algo')
      .setInteractive()
      .on('pointerdown', () => {
        this.activeGeneratorIndex = Phaser.Math.Wrap(this.activeGeneratorIndex + 1, 0, this.generators.length);

        this._updateActiveGeneratorName();
      });
    this.currentAlgoText = this.add.text(25, 470, '');

    this.add.text(175, 450, 'generate')
      .setInteractive()
      .on('pointerdown', () => {
        this._reset();

        this._getActiveGenerator().generator.generate();
      });

    this.add.text(300, 450, 'reset')
      .setInteractive()
      .on('pointerdown', () => {
        this._reset();
      });

    this.add.text(380, 450, 'randomize')
      .setInteractive()
      .on('pointerdown', () => {
        const rows = Phaser.Math.RND.between(2, 10);
        const cols = Phaser.Math.RND.between(2, 10);
        grid.setSize(rows, cols);
        this.gridView.refresh();
      });

    this._updateActiveGeneratorName();
  }

  _reset() {
    this.destroyedWallCount = 0;
    this.scheduler.removeAllEvents();

    const generator = this._getActiveGenerator().generator;

    generator.reset();
    this.gridView.reset();
  }

  scheduleNextWallRemoval(cell1, cell2) {
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

  _getActiveGenerator() {
    return this.generators[this.activeGeneratorIndex];
  }

  _updateActiveGeneratorName() {
    this.currentAlgoText.text = `algo: ${this._getActiveGenerator().name}`;
  }
}

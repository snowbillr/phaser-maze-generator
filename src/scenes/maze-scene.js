import 'phaser'
import { RecursiveBacktracker } from '../generators/recursive-backtracker';
import { GridView } from '../entities/grid-view';
import { Grid } from '../models/grid';
import { RandomizedKruskal } from '../generators/randomized-kruskal';

export class MazeScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(0xcacaca);

    const rows = 5;
    const cols = 8;

    const grid = new Grid(rows, cols);
    const gridView = new GridView(this, grid, 250, 250);

    this.generators = [
      {
        name: 'Recursive Backtracer',
        generator: new RecursiveBacktracker(this, grid, gridView),
      },
      {
        name: 'Randomized Kruskal',
        generator: new RandomizedKruskal(this, grid, gridView),
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
        const generator = this._getActiveGenerator().generator;

        generator.reset();
        gridView.reset();

        generator.generate();
      });

    this.add.text(300, 450, 'reset')
      .setInteractive()
      .on('pointerdown', () => {
        const generator = this._getActiveGenerator().generator;

        generator.reset();
        gridView.reset();
      });

    this.add.text(380, 450, 'randomize')
      .setInteractive()
      .on('pointerdown', () => {
        const rows = Phaser.Math.RND.between(2, 10);
        const cols = Phaser.Math.RND.between(2, 10);
        grid.setSize(rows, cols);
        gridView.refresh();
      });

    this._updateActiveGeneratorName();
  }

  _getActiveGenerator() {
    return this.generators[this.activeGeneratorIndex];
  }

  _updateActiveGeneratorName() {
    this.currentAlgoText.text = `algo: ${this._getActiveGenerator().name}`;
  }
}

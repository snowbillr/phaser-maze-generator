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

    // const generator = new RecursiveBacktracker(this, grid, gridView);
    const generator = new RandomizedKruskal(this, grid, gridView);

    this.add.text(50, 450, 'generate')
      .setInteractive()
      .on('pointerdown', () => {
        generator.reset();
        gridView.reset();

        generator.generate();
      });

    this.add.text(150, 450, 'reset')
      .setInteractive()
      .on('pointerdown', () => {
        generator.reset();
        gridView.reset();
      });

    this.add.text(250, 450, 'randomize size')
      .setInteractive()
      .on('pointerdown', () => {
        const rows = Phaser.Math.RND.between(2, 10);
        const cols = Phaser.Math.RND.between(2, 10);
        grid.setSize(rows, cols);
        gridView.refresh();
      })
  }
}

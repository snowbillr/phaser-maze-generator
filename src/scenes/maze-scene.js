import 'phaser'
// import { Grid } from '../grid';
import { RecursiveBacktracker } from '../generators/recursive-backtracker';
import { GridView } from '../entities/grid-view';
import { Grid } from '../models/grid';

export class MazeScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(0xcacaca);

    const rows = 3;
    const cols = 3;

    const grid = new Grid(rows, cols);
    const gridView = new GridView(this, grid, 250, 250);

    const generator = new RecursiveBacktracker(this, grid, gridView);

    this.add.text(50, 450, 'generate')
      .setInteractive()
      .on('pointerdown', () => {
        generator.reset();

        generator.generate();
      });

    this.add.text(150, 450, 'reset')
      .setInteractive()
      .on('pointerdown', () => {
        generator.reset();
      });
  }
}

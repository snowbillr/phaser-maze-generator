import 'phaser'
import { Grid } from '../grid';
import { RecursiveBacktracker } from '../generators/recursive-backtracker';

export class MazeScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(0xcacaca);

    const rows = 10;
    const cols = 10;
    const cellSize = 40;

    const grid = new Grid(this, rows, cols, cellSize);
    const generator = new RecursiveBacktracker(this, grid);

    this.add.text(50, 450, 'generate')
      .setInteractive()
      .on('pointerdown', () => {
        grid.reset();
        generator.reset();

        generator.generate();
      });

    this.add.text(150, 450, 'reset')
      .setInteractive()
      .on('pointerdown', () => {
        grid.reset();
        generator.reset();
      });
  }
}

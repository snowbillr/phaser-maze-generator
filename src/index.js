import 'phaser';

import { MazeScene } from './scenes/maze-scene';

const gameConfig = {
  width: 500,
  height: 500,
  scene: MazeScene
};

new Phaser.Game(gameConfig);

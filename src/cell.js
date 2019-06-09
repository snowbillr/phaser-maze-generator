import 'phaser';

export class Cell {
  constructor(scene, x, y, size) {
    this.size = size;
    this.borderWidth = 1;

    this.rectangle = scene.add.rectangle(x, y, size, size, 0xffffff)
    this.topWall = scene.add.rectangle(x, y - size / 2 + this.borderWidth, size, this.borderWidth, 0x000000);
    this.bottomWall = scene.add.rectangle(x, y + size / 2, size, this.borderWidth, 0x000000);
    this.leftWall = scene.add.rectangle(x - size / 2 + this.borderWidth, y, this.borderWidth, size, 0x000000);
    this.rightWall = scene.add.rectangle(x + size / 2, y, this.borderWidth, size, 0x000000);
  }

  setBackground(hexCode) {
    this.rectangle.fillColor = hexCode;
  }

  removeTopWall() {
    this.topWall.visible = false;
  }

  removeBottomWall() {
    this.bottomWall.visible = false;
  }

  removeLeftWall() {
    this.leftWall.visible = false;
  }

  removeRightWall() {
    this.rightWall.visible = false;
  }
}

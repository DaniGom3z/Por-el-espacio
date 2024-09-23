// Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
      super(scene, x, y, "enemy");
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setDepth(1);
      this.speed = 100;
    }
  
    update(ship) {
      this.scene.physics.moveToObject(this, ship, this.speed);
    }
  }
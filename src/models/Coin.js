// Coin.js
export default class Coin extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
      super(scene, x, y, "coin");
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setDepth(1);
      this.setActive(false);
      this.setVisible(false);
    }
  
    spawn(x, y) {
      this.setActive(true);
      this.setVisible(true);
      this.setPosition(x, y);
      this.body.reset(x, y);
    }
  
    update() {
      this.y += Math.sin(this.scene.time.now / 500) * 2;
    }
  }
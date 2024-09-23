import SceneA from './Scenes/SceneA.js';
import SceneB from './Scenes/SceneB.js';

const config = {
  type: Phaser.AUTO,
  width: 1536,
  height: 735,
  pixelArt: true,
  backgroundColor: "#000000",
  parent: "phaser-example",
  scene: [SceneA, SceneB],
  physics: {
    default: "arcade",
  },
};

const game = new Phaser.Game(config);
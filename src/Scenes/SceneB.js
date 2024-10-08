import Bullet from '../models/Bullet.js';
import Enemy from '../models/Enemy.js';
import Coin from '../models/Coin.js';


export default class SceneB extends Phaser.Scene {
    lastFired = 0;
  
    constructor() {
      super({ key: "SceneB" });
      this.initializeGameVariables();
      this.initializeWorkers();
    }
  
    initializeGameVariables() {
      this.lives = 10;
      this.score = 0;
      this.enemyCount = 10;
      this.enemySpeed = 100;
      this.coinCount = 0;
    }
  
    initializeWorkers() {
      this.coinWorker = new Worker("/src/workers/coinWorker.js");
      this.musicWorker = new Worker("/src/workers/musicWorker.js");
      this.scoreWorker = new Worker("/src/workers/scoreWorker.js");
      this.collisionWorker = new Worker("/src/workers/collisionWorker.js");
  
      this.backgroundMusic = null;
  
      this.musicWorker.onmessage = (e) => {
        if (e.data === "play") {
          this.backgroundMusic.play();
        } else if (e.data === "stop") {
          this.backgroundMusic.stop();
        } else if (e.data === "pause") {
          this.backgroundMusic.pause();
        }
      };
  
      this.coinWorker.onmessage = (e) => {
        console.log("Mensaje recibido del worker:", e.data);
        this.coinCount = e.data.coinCount;
        this.coinsText.setText(`Monedas: ${this.coinCount}`);
  
        // Si ganaste una vida
        if (e.data.lifeGained) {
          this.lives++;
          this.livesText.setText(`Vidas: ${this.lives}`);
        }
  
        // Manejo de bonus
        if (e.data.bonus) {
          if (e.data.bonus === "extraPoints") {
            this.score += 50;
            this.scoreText.setText(`Puntos: ${this.score}`);
          } 
        }
      };
  
      this.scoreWorker.onmessage = (e) => {
        this.score += e.data;
        this.scoreText.setText(`Puntos: ${this.score}`);
      };
      this.collisionWorker.onmessage = (e) => {
        const { lives, gameOver } = e.data;
        this.lives = lives;
        if (gameOver) {
          this.endGame();
        }
      };
    }
  
    preload() {
      this.load.image("background", "/assets/images/nebula.jpg");
      this.load.image("stars", "assets/images/stars.png");
      this.load.atlas(
        "space",
        "assets/images/space.png",
        "assets/json/space.json"
      );
      this.load.image("enemy", "assets/images/ufo2.png");
      this.load.image("coin", "assets/images/coin.png");
      this.load.audio("backgroundMusic", "/assets/Music/Interstellar.mp3");
    }
  
    create() {
      this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true });
      this.playBackgroundMusic();
      this.isMusicPlaying = false;
  
      const muteButton = this.add
        .text(1450, 20, "⏯️", { fontSize: "32px", fill: "#fff" })
        .setInteractive()
        .setDepth(4)
        .setScrollFactor(0)
        .on("pointerdown", () => {
          if (this.isMusicPlaying) {
            this.pauseBackgroundMusic();
            this.isMusicPlaying = false; // Actualiza el estado
            muteButton.setText("▶️"); // Cambia el icono a "reproducir"
          } else {
            this.playBackgroundMusic();
            this.isMusicPlaying = true; // Actualiza el estado
            muteButton.setText("⏸️"); // Cambia el icono a "pausar"
          }
        });
  
      this.textures.addSpriteSheetFromAtlas("enemy-sheet", {
        atlas: "space",
        frame: "enemy",
        frameWidth: 64,
      }); // Carga el sprite del enemigo
      this.livesText = this.add.text(16, 16, `Vidas: ${this.lives}`, {
        fontSize: "32px",
        fill: "#fff",
      }).setScrollFactor(0).setDepth(100);
      this.scoreText = this.add.text(16, 50, `Puntos: ${this.score}`, {
        fontSize: "32px",
        fill: "#fff",
      }).setScrollFactor(0).setDepth(100);
      this.coinsText = this.add.text(16, 84, `Monedas: ${this.coinCount}`, {
        fontSize: "32px",
        fill: "#fff",
      }).setScrollFactor(0).setDepth(100);
      this.indicacionText = this.add.text(460, 20, `⬅️⬆️➡️ para moverse Espacio para disparar`, {
        fontSize: "32px",
        fill: "#fff",
      }).setScrollFactor(0).setDepth(100);
  
      //  Prepare some spritesheets and animations
      this.textures.addSpriteSheetFromAtlas("mine-sheet", {
        atlas: "space",
        frame: "mine",
        frameWidth: 64,
      });
      this.textures.addSpriteSheetFromAtlas("asteroid1-sheet", {
        atlas: "space",
        frame: "asteroid1",
        frameWidth: 96,
      });
      this.textures.addSpriteSheetFromAtlas("asteroid2-sheet", {
        atlas: "space",
        frame: "asteroid2",
        frameWidth: 96,
      });
      this.textures.addSpriteSheetFromAtlas("asteroid3-sheet", {
        atlas: "space",
        frame: "asteroid3",
        frameWidth: 96,
      });
      this.textures.addSpriteSheetFromAtlas("asteroid4-sheet", {
        atlas: "space",
        frame: "asteroid4",
        frameWidth: 64,
      });
  
      this.anims.create({
        key: "mine-anim",
        frames: this.anims.generateFrameNumbers("mine-sheet", {
          start: 0,
          end: 15,
        }),
        frameRate: 20,
        repeat: -1,
      });
      this.anims.create({
        key: "asteroid1-anim",
        frames: this.anims.generateFrameNumbers("asteroid1-sheet", {
          start: 0,
          end: 24,
        }),
        frameRate: 20,
        repeat: -1,
      });
      this.anims.create({
        key: "asteroid2-anim",
        frames: this.anims.generateFrameNumbers("asteroid2-sheet", {
          start: 0,
          end: 24,
        }),
        frameRate: 20,
        repeat: -1,
      });
      this.anims.create({
        key: "asteroid3-anim",
        frames: this.anims.generateFrameNumbers("asteroid3-sheet", {
          start: 0,
          end: 24,
        }),
        frameRate: 20,
        repeat: -1,
      });
      this.anims.create({
        key: "asteroid4-anim",
        frames: this.anims.generateFrameNumbers("asteroid4-sheet", {
          start: 0,
          end: 23,
        }),
        frameRate: 20,
        repeat: -1,
      });
  
      //  World size is 8000 x 6000
      this.bg = this.add
        .tileSprite(400, 300, 2300, 900, "background")
        .setScrollFactor(0);
  
      //  Add our planets, etc
      this.add
        .image(512, 680, "space", "blue-planet")
        .setOrigin(0)
        .setScrollFactor(0.6);
      this.add
        .image(2833, 1246, "space", "brown-planet")
        .setOrigin(0)
        .setScrollFactor(0.6);
      this.add.image(3875, 531, "space", "sun").setOrigin(0).setScrollFactor(0.6);
      const galaxy = this.add
        .image(5345 + 1024, 327 + 1024, "space", "galaxy")
        .setBlendMode(1)
        .setScrollFactor(0.6);
      this.add
        .image(908, 3922, "space", "gas-giant")
        .setOrigin(0)
        .setScrollFactor(0.6);
      this.add
        .image(3140, 2974, "space", "brown-planet")
        .setOrigin(0)
        .setScrollFactor(0.6)
        .setScale(0.8)
        .setTint(0x882d2d);
      this.add
        .image(6052, 4280, "space", "purple-planet")
        .setOrigin(0)
        .setScrollFactor(0.6);
  
      for (let i = 0; i < 8; i++) {
        this.add
          .image(
            Phaser.Math.Between(0, 8000),
            Phaser.Math.Between(0, 6000),
            "space",
            "eyes"
          )
          .setBlendMode(1)
          .setScrollFactor(0.8);
      }
  
      this.stars = this.add
        .tileSprite(400, 300, 800, 600, "stars")
        .setScrollFactor(0);
  
      const emitter = this.add.particles(0, 0, "space", {
        frame: "blue",
        speed: 100,
        lifespan: {
          onEmit: (particle, key, t, value) => {
            return Phaser.Math.Percent(this.ship.body.speed, 0, 300) * 2000;
          },
        },
        alpha: {
          onEmit: (particle, key, t, value) => {
            return Phaser.Math.Percent(this.ship.body.speed, 0, 300);
          },
        },
        angle: {
          onEmit: (particle, key, t, value) => {
            return this.ship.angle - 180 + Phaser.Math.Between(-10, 10);
          },
        },
        scale: { start: 0.6, end: 0 },
        blendMode: "ADD",
      });
  
      this.bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true,
      });
  
      this.enemies = this.physics.add.group({
        classType: Enemy,
      });
  
      this.coins = this.physics.add.group({
        classType: Coin,
      });
  
      this.time.addEvent({
        delay: 1000,
        callback: this.spawnCoin,
        callbackScope: this,
        loop: true,
      });
  
      this.spawnEnemies(this.enemyCount);
  
      this.ship = this.physics.add.image(4000, 3000, "space", "ship").setDepth(2);
      this.ship.setDrag(300);
      this.ship.setAngularDrag(400);
      this.ship.setMaxVelocity(600);
  
      emitter.startFollow(this.ship);
  
      this.cameras.main.startFollow(this.ship);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
      this.physics.add.overlap(
        this.ship,
        this.enemies,
        this.hitEnemy,
        null,
        this
      ); // Colisión nave-enemigos
      this.physics.add.overlap(
        this.bullets,
        this.enemies,
        this.destroyEnemy,
        null,
        this
      ); // Colisión balas-enemigos
      this.physics.add.overlap(
        this.ship,
        this.coins,
        this.collectCoin,
        null,
        this
      );
  
      this.tweens.add({
        targets: galaxy,
        angle: 360,
        duration: 100000,
        ease: "Linear",
        loop: -1,
      });
    }
  
    pauseBackgroundMusic() {
      this.musicWorker.postMessage({ action: "pause" });
    }
  
    playBackgroundMusic() {
      this.musicWorker.postMessage({ action: "play" });
    }
  
    update(time, delta) {
      const { left, right, up } = this.cursors;
  
      if (left.isDown) {
        this.ship.setAngularVelocity(-200);
      } else if (right.isDown) {
        this.ship.setAngularVelocity(200);
      } else {
        this.ship.setAngularVelocity(0);
      }
  
      if (up.isDown) {
        this.physics.velocityFromRotation(
          this.ship.rotation,
          100,
          this.ship.body.acceleration
        );
      } else {
        this.ship.setAcceleration(0);
      }
  
      if (this.fire.isDown && time > this.lastFired) {
        const bullet = this.bullets.get();
  
        if (bullet) {
          bullet.fire(this.ship);
  
          this.lastFired = time + 200;
        }
      }
  
      this.bg.tilePositionX += this.ship.body.deltaX() * 0.5;
      this.bg.tilePositionY += this.ship.body.deltaY() * 0.5;
  
      this.stars.tilePositionX += this.ship.body.deltaX() * 2;
      this.stars.tilePositionY += this.ship.body.deltaY() * 2;
  
      this.enemies.children.iterate((enemy) => {
        if (enemy.active) {
          enemy.update(this.ship);
        }
      });
  
      this.livesText.setText(`Vidas: ${this.lives}`);
      this.scoreText.setText(`Puntos: ${this.score}`);
  
      this.coins.children.iterate((coin) => {
        if (coin.active) {
          coin.update();
        }
      });
    }
  
    collectCoin(player, coin) {
      coin.destroy();
  
      // Enviar mensaje al worker
      this.coinWorker.postMessage("collectCoin");
    }
  
    spawnCoin() {
      const coin = this.coins.get();
      if (coin) {
        const x = Phaser.Math.Between(0, 8000);
        const y = Phaser.Math.Between(0, 6000);
        coin.spawn(x, y);
      }
    }
  
    spawnEnemies(count) {
      for (let i = 0; i < count; i++) {
        const enemy = this.enemies.get();
        if (enemy) {
          enemy.setPosition(
            Phaser.Math.Between(0, 8000),
            Phaser.Math.Between(0, 6000)
          );
          enemy.speed = this.enemySpeed;
          enemy.setActive(true);
          enemy.setVisible(true);
        }
      }
    }
  
    hitEnemy(ship, enemy) {
      if (!enemy.active) return; // Verificar si el enemigo sigue activo
  
      this.lives -= 1; // Restar una vida
      enemy.setActive(false);
      enemy.setVisible(false);
      enemy.body.stop();
  
      // Añadir un breve período de invulnerabilidad después de la colisión
      ship.setTint(0xff0000); // Cambia el color para indicar daño
      this.time.delayedCall(1000, () => {
        ship.clearTint(); // Eliminar el efecto de daño después de 1 segundo
      });
  
      this.collisionWorker.postMessage({ lives: this.lives }); // Envía un mensaje al worker para verificar colisiones
    }
  
    destroyEnemy(bullet, enemy) {
      if (!bullet.active || !enemy.active) return;
  
      bullet.setActive(false);
      bullet.setVisible(false);
      bullet.body.stop();
  
      enemy.setActive(false);
      enemy.setVisible(false);
      enemy.body.stop();
  
      // Verifica si se deben spawnear más enemigos
      if (this.score % 20 === 0) {
        this.enemyCount += 1;
        this.enemySpeed += 5;
  
        if (this.enemies.getTotalFree() > 0) {
          this.spawnEnemies(2);
        }
  
        if (this.score >= 300 ) {
            this.spawnEnemies(2);
        }
  
        if (this.score >= 500 ) {
          this.spawnEnemies(5);
      }
  
      }
  
      this.scoreWorker.postMessage(10); 
    }
  
    endGame() {
      this.physics.pause();
      this.musicWorker.postMessage({ action: "stop" });
  
      // Asegúrate de que el fondo esté correctamente detenido si es necesario
      if (this.background) {
        this.background.setScrollFactor(0); // Detener el fondo si está en movimiento
      }
  
      // Desactivar la nave
      this.ship.setTint(0xff0000); // Cambiar el color de la nave
      this.ship.setAngularVelocity(0);
      this.ship.setAcceleration(0);
  
      // Mostrar un mensaje de "Game Over" en la pantalla
      const gameOverText = this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "Game Over",
          {
            fontSize: "64px",
            fill: "#ff0000",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(8);
  
      // Crear un botón visible para reiniciar el juego
      const restartButton = this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 100,
          "Reiniciar",
          {
            fontSize: "32px",
            fill: "#ffffff",
            backgroundColor: "#001bff",
            padding: { x: 20, y: 10 },
          }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true }) // Hacerlo interactivo
        .on("pointerdown", () => this.restartGame(gameOverText, restartButton))
        .setScrollFactor(0)
        .setDepth(8); // Reiniciar cuando se hace clic
    }
  
    restartGame(gameOverText, restartButton) {
      gameOverText.destroy();
      restartButton.destroy();
  
      this.lives = 10;
      this.score = 0;
      this.coinCount = 0;
  
      this.enemyCount = 10; 
      this.enemySpeed = 100; 
  
      this.ship.clearTint(); 
      this.scene.restart(); 
    }
  }
  
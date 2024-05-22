// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super({ key: "game" });
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.gameOver = false;
    this.timer = 40;
    this.shapes = {
      diamante: { points: 10, count: 0 },
      esmeralda: { points: 20, count: 0 },
    };
    this.score = 0;
  }

  preload() {
    // load assets
    this.load.image("Cielo", "./public/assets/Cielo.webp");
    this.load.image("Ninja", "./public/assets/Ninja.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamante", "./public/assets/diamante.png");
    this.load.image("esmeralda", "./public/assets/esmeralda.jpg");
  }

  create() {
    // create game objects
    const cielo = this.add.image(400, 300, "Cielo");
    cielo.setScale(2);
    //crear grupo de plataformas con fisicas
    this.plataformas = this.physics.add.staticGroup();
    // creando la plataforma y su info
    this.plataformas.create(400, 600, "platform").setScale(2).refreshBody();
    this.plataformas.create(400, 200, "platform");
    this.plataformas.create(700, 400, "platform");
    this.plataformas.create(100, 400, "platform");
    //create personaje
    this.ninja = this.physics.add
      .image(400, 300, "Ninja")
      .setScale(0.2)
      .setCollideWorldBounds(true)
      .setBounce(0)
      .setOrigin(0.5)
      .setVelocity(0);
    //colision plataforma y personaje
    this.physics.add.collider(this.ninja, this.plataformas);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    //evento cada 1 seg
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTimer,
      callbackScope: this,
      loop: true,
    });
    //agregar texto de timer en la esquina superior derecha
    this.timerText = this.add.text(26, 26, `tiempo restante: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    //crear grupo recolectables y sus coliciones
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.plataformas, this.recolectables);
    this.physics.add.overlap(
      this.ninja,
      this.recolectables,
      this.onShapeCollect,
      null,
      this
    );
    function collect(ninja, recolectables) {
      recolectables.destroy();
    }
    //creando score
    this.scoreText = this.add.text(
      550,
      20,
      `score: ${this.score}
    D:${this.shapes["diamante"].count}
    E:${this.shapes["esmeralda"].count}`,
      {
        fontSize: "32px",
        fill: "#000",
      }
    );

    //evento 1 seg
    this.time.addEvent({
      delay: 2000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  onSecond() {
    //crear objetos recolectables aleatorios
    if (this.gameOver) {
      return;
    }
    const tipos = ["diamante", "esmeralda"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables
      .create(Phaser.Math.Between(10, 790), 0, tipo)
      .setScale(0.2)
      .setBounce(1);
  }
  //creando sistema de score y anotado de recoleccion de elementos
  onShapeCollect(personaje, recolectable) {
    const nombregem = recolectable.texture.key;
    console.log("score", this.score);
    this.shapes[nombregem].count += 1;
    const puntosgem = this.shapes[nombregem].points;
    this.score += puntosgem;
    console.log("recolectado", recolectable.texture.key);
    this.scoreText.setText(
      `Puntaje:${this.score} / D:${this.shapes["diamante"].count}/ E:${this.shapes["esmeralda"].count}`
    );
    recolectable.destroy();

    this.scoreText.setText(
      `Score:${this.score}
      D:${this.shapes["diamante"].count}
      E:${this.shapes["esmeralda"].count}
      `
    );

    const cumplePuntos = this.score >= 100;
    const cumpleGems =
      this.shapes["diamante"].count >= 2 && this.shapes["esmeralda"].count >= 2;
    if (cumplePuntos && cumpleGems) {
      console.log("ganaste");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
    }
  }
  update() {
    if (this.cursor.right.isDown) {
      this.ninja.setVelocityX(160);
    } else if (this.cursor.left.isDown) {
      this.ninja.setVelocityX(-160);
    } else {
      this.ninja.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.ninja.body.touching.down) {
      this.ninja.setVelocityY(-330);
    }
    //insertar game over
    if (this.gameOver && this.r.isDown) {
      this.scene.restart();
    }
    if (this.gameOver) {
      this.physics.pause();
      this.timerText.setText("Game over");
    }
  }
}

// update game objects

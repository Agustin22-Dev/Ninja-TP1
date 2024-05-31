// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super({key:'game'});
  }

  init() {
    this.gameOver = false;
    this.temporizador= 30;
    this.score = 0;
    this.shapes = {
      diamante: {points: 10, count:0},
      esmeralda: { points: 20, count:0},
      ruby:{points: 30, count:0},
      bomb:{points: -10, count:0}
    };
  }

  preload() {
    // load assets
    this.load.image("Cielo","./public/assets/Cielo.webp")
    this.load.image("Ninja","./public/assets/Ninja.png")
    this.load.image("platform","./public/assets/platform.png")
    this.load.image("diamante","./public/assets/diamante.png")
    this.load.image("esmeralda","./public/assets/esmeralda.png")
    this.load.image("bomb","./public/assets/bomb.png")
    this.load.image("ruby","./public/assets/ruby.png")
   
  }
 
  create() {
    // crear fondo
    const cielo=this.add.image(400,300,"Cielo");
    cielo.setScale(2);
    //crear grupo de plataformas con fisicas
    this.plataformas= this.physics.add.staticGroup(); 
    // creando la plataforma y su info
     this.plataformas.create(400,600,"platform").setScale(2).refreshBody();
     this.plataformas.create(400,200,"platform");
     this.plataformas.create(700,400,'platform');
     this.plataformas.create(100,400,'platform');
    //create personaje
   this.ninja=this.physics.add.image(400,300,"Ninja");
    this.ninja.setScale(0.2)
    this.ninja.setCollideWorldBounds(true);
    this.ninja.setBounce(0)
    this.ninja.setOrigin(0.5)
    this.ninja.setVelocity(0)
    //colision plataforma y personaje
    this.physics.add.collider(this.ninja,this.plataformas);

    //crear teclas
    this.cursor= this.input.keyboard.createCursorKeys();

    //crear reset con R
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    
    //crear grupo recolectables y sus coliciones
    this.recolectables= this.physics.add.group();

  //agregar collider entre recolectables y personaje
   this.physics.add.collider(
     this.ninja,
    this.recolectables,
      this.onShapeCollect,
      null,
      this
    );

     //agregar collider entre recolectables y plataformas
     this.physics.add.collider(
      this.recolectables,
      this.plataformas,
      this.onRecolectableBounced,
      null,
      this
    );
  
  
   //creando score 
   this.scoreText = this.add.text(
    10,
    50,
    `Puntaje: ${this.score}
      D: ${this.shapes["diamante"].count}
      E: ${this.shapes["esmeralda"].count}
      R: ${this.shapes["ruby"].count}`);

  //evento 1 seg
  this.time.addEvent({
  delay:1000,
  callback: this.onSecond,
  callbackScope:this,
  loop:true,
  });
  }
  
  //crear funcion para recolectar
  onShapeCollect(Ninja,recolectable){
    const nombreFig= recolectable.getData("tipo");
    const points = recolectable.getData("points");
    
    this.score += points;
    this.shapes[nombreFig].count += 1;
    console.table(this.shapes);
    console.log("recolectado ", recolectable.texture.key, points);
    console.log("score ", this.score);
    recolectable.destroy();

    this.scoreText.setText(
      `puntaje:${this.score}
      D:${this.shapes["diamante"].count}
      E:${this.shapes["esmeralda"].count}
      R:${this.shapes["ruby"].count}`
    );
    this.checkWin();
  }

  //crear condicion de victoria
  checkWin(){
    const cumplePuntos= this.score >= 100;
    const cumpleFiguras=
    this.shapes["diamante"].count >= 2 &&
    this.shapes["esmeralda"].count >= 2 &&
    this.shapes["ruby"].count >= 2

    if(cumplePuntos && cumpleFiguras){
      console.log("Ganaste");
      this.scene.start("end",{
        score:this.score,
        gameOver: this.gameOver,
      })
    }
  }
  
//crear temporizador
  handlerTimer(){
    this.temporizador -=1;
    this.timerText.setText(`tiempo restante:${this.temporizador}`);
    if(this.timer===0){
      this.gameOver= true;
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onRecolectableBounced(recolectable,plataforma){
    let points= recolectable.getData("points");
    points -=5;
    recolectable.setData("points",points);
    if(points <=0){
      recolectable.destroy();
    }
  }

  onSecond(){
    if (this.gameOver) {
      return;
    }
    // crear recolectable
    const tipos = ["diamante","esmeralda","ruby","bomb"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo,
    );
    recolectable.setVelocity(0, 100);
    recolectable.setScale(0.3);

    //asignar rebote: busca un numero entre 0.4 y 0.8
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);
    recolectable.setBounce(rebote);

    //set data
    recolectable.setData("points", this.shapes[tipo].points);
    recolectable.setData("tipo", tipo);

    }
  
    
    update() {
      if (this.gameOver && this.r.isDown) {
        this.scene.restart();
      }
      if (this.gameOver) {
        this.physics.pause();
        this.timerText.setText("Game Over");
        return;
      }
      if(this.cursor.right.isDown){
        this.ninja.setVelocityX(160);
      } else if (this.cursor.left.isDown) {
        this.ninja.setVelocityX(-160);
      } else {
        this.ninja.setVelocityX(0);
      }
      if (this.cursor.up.isDown && this.ninja.body.touching.down) {
        this.ninja.setVelocityY(-330);
      }
     }; 
    }
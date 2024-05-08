// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("Cielo","../public/assets/Cielo.webp");
    this.load.image("Ninja","../public/assets/Ninja.png");
    this.load.image("platform","../public/assets/platform.png");
    this.load.image("diamante", "../public/assets/diamante.png");

  }

  create() {
    // create game objects
    const cielo=this.add.image(400,300,"Cielo");
    cielo.setScale(2);
    //crear grupo de plataformas con fisicas
    this.plataformas= this.physics.add.staticGroup(); 
    // creando la plataforma y su info
     this.plataformas.create(400,560,"platform").setScale(2).refreshBody();
     this.plataformas.create(100,300,"platform");
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

    //crear grupo recolectables
    this.recolectables= this.physics.add.group();
    this.physics.add.collider(this.ninja, this.recolectables);

  //evento 1 seg
  this.time.addEvent({
  delay:1000,
  callback: this.onSecond,
  callbackScope:this,
  loop:true,
  });
  }

  onSecond(){
    //crear objetos recolectables aleatorios
    const tipos = ["diamante"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(Phaser.Math.Between(10,790),0,tipo).setScale(0.5);
    recolectable.setVelocity(0,100)
  }
  
update() {
  if(this.cursor.right.isDown){
    this.ninja.setVelocity(160);
  } else if (this.cursor.left.isDown) {
    this.ninja.setVelocityX(-160);
  } else {
    this.ninja.setVelocityX(0);
  }
  if (this.cursor.up.isDown && this.ninja.body.touching.down) {
    this.ninja.setVelocityY(-330);
  }
    }
    // update game objects
}

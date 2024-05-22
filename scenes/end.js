export default class end extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super({ key: "end" });
  }
  init(data) {
    this.score = data.score;
    this.gameOver = data.gameOver || true;
  }
  create() {
    this.add
      .text(200, 300, this.gameOver ? "Game over" : "You win", {
        fontSize: "40px",
        color: "#ffff",
      })
      .setOrigin(0.5);

    this.add.text(400, 350, `score:${this.score}`);
  }
}

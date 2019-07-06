window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    document.getElementById("game-board").style.display = "block";
    document.getElementsByClassName("game-intro")[0].style.display = "none";
    let game = new Game();
    // I'll use a game loop instaed of just keydown to get rid of the delay in events when keeping a key pressed
    window.addEventListener("keydown", game.keyDown.bind(game));
    window.addEventListener("keyup", game.keyUp.bind(game));
  };
};

class Game {
  constructor() {
    this.speed = 12;
    this.canvas = document.querySelector("#game-board canvas");
    this.startGame();
    this.tickId = setInterval(this.tick.bind(this), 50);
    this.currentKey = undefined;
  }

  startGame() {
    let board = document.getElementById("game-board");
    this.canvas.width = board.clientWidth;
    this.canvas.height = document.getElementById("game-board").clientHeight;
    this.road = {
      borderL: this.canvas.width * 0.1,
      borderR: this.canvas.width * 0.9
    }
    this.drawRoad();
    this.carImg = new Image();
    this.carImg.onload = function () {
      this.car = {
        x: this.canvas.width / 2 - this.carImg.width / 2,
        y: this.canvas.height - 5 - this.carImg.height
      }
      this.drawCar();
    }.bind(this);
    this.carImg.src = "images/car.png"
  }

  drawRoad() {
    let ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, this.road.borderL, this.canvas.height);
    ctx.fillRect(this.road.borderR, 0, this.canvas.width * 0.1, this.canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(this.canvas.width * 0.1, 0, this.canvas.width * 0.8, this.canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(this.canvas.width * 0.13, 0, this.canvas.width * 0.03, this.canvas.height);
    ctx.fillRect(this.canvas.width * 0.87, 0, this.canvas.width * 0.03, this.canvas.height);
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(this.canvas.width * 0.49, i * (this.canvas.height / 10) + (this.canvas.height / 40), this.canvas.width * 0.02, this.canvas.height / 20);
    }
  }

  drawCar() {
    let ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.carImg, 0, 0, this.carImg.width, this.carImg.height, this.car.x, this.car.y, this.carImg.width, this.carImg.height)
  }

  tick() {
    if (this.currentKey) {
      let oldPosition = {
        x: this.car.x,
        y: this.car.y
      }
      this.car.x = this.currentKey === "ArrowRight" ? this.car.x + this.speed : this.car.x - this.speed;
      if (this.checkCollision()) {
        // reset position
        this.car.x = oldPosition.x;
        this.car.y = oldPosition.y;
      } else {
        this.drawRoad();
        this.drawCar();
      }
    }
  }

  keyDown(e) {
    if (!e.key || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    this.currentKey = e.key;
  }

  keyUp(e) {
    if (!e.key || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    // the if check here allows pressing a second key before releasing the old one
    if(this.currentKey === e.key)this.currentKey = undefined;
  }

  checkCollision() {
    if (this.car.x <= this.road.borderL) return true;
    if (this.car.x + this.carImg.width >= this.road.borderR) return true;
    return false;
  }
}
function initGame(){
  const GRAVITY = 0.5;
  const JUMP_STRENGTH = 12;
  const TRANSITION_TIME = 50;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let gameInterval;

  class Robot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.width = 30;
      this.height = 30;
      this.shape = 'square';
      this.transitionCounter = 0;
    }

    changeShape() {
      if (this.transitionCounter === 0) {
        this.shape = this.shape === 'square' ? 'circle' : 'square';
        this.transitionCounter = TRANSITION_TIME;
      }
    }

    update() {
      this.vy += GRAVITY;
      this.x += this.vx;
      this.y += this.vy;

      if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
        this.vy = -JUMP_STRENGTH;
      }

      if (this.transitionCounter > 0) {
        this.transitionCounter--;
      }
    }

    draw() {
      ctx.fillStyle = 'blue';
      if (this.shape === 'square') {
        ctx.fillRect(this.x, this.y, this.width, this.height);
      } else {
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  const robot = new Robot(50, 200);

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update game objects
      robot.update();

      // Draw game objects
      robot.draw();
    }

    // Add event listeners for user input
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        robot.changeShape();
      }
    });

    // Initialize game loop
    gameInterval = setInterval(gameLoop, 1000 / 60);
  }

  gameLoop();

}


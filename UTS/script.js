const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dino = {
  x: 50,
  y: canvas.height - 50,
  width: 50,
  height: 35, // Adjusted the height to make it look like an animal
  speedY: 0,
  gravity: 0.5,
  jumpStrength: -15,
  isJumping: false,
  draw: function() {
    const base_image = new Image()
    base_image.src = './sapi.png'
    ctx.drawImage(base_image, this.x, this.y - 50,  100, 85);

    // Drawing animal
    // ctx.fillStyle = '#008000'; // Green color
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y + this.height);
    // ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
    // ctx.lineTo(this.x + this.width, this.y + this.height);
    // ctx.lineTo(this.x + this.width / 2, this.y);
    // ctx.closePath();

    
    // ctx.fill();
  },
  jump: function() {
    if (!this.isJumping) {
      this.speedY = this.jumpStrength;
      this.isJumping = true;
    }
  },
  update: function() {
    this.speedY += this.gravity;
    this.y += this.speedY;
    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.isJumping = false;
    }
  }
};

const obstacles = [];
let score = 0;
let difficulty = 5; // initial obstacle speed

function createObstacle() {
  const obstacle = {
    x: canvas.width,
    y: canvas.height - 50,
    width: 20,
    height: 50,
    speedX: -difficulty
  };
  obstacles.push(obstacle);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dino.draw();
  obstacles.forEach(obstacle => {
    ctx.fillStyle = 'purple'; // Red color
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function update() {
  dino.update();
  obstacles.forEach(obstacle => {
    obstacle.x += obstacle.speedX;
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    ) {
      endGame();
    } else if (obstacle.x + obstacle.width < dino.x && !obstacle.passed) {
      obstacle.passed = true;
      score++;
      document.getElementById('score').innerText = 'Score: ' + score;
      if (score % 10 === 0) { // increase difficulty every 10 points
        difficulty += 1;
      }
    }
  });
}

function endGame() {
  alert('Game Over! Your score: ' + score);
  resetGame();
}

function resetGame() {
  obstacles.length = 0;
  score = 0;
  difficulty = 5;
}

function loop() {
  draw();
  update();
  if (Math.random() < 0.02) {
    createObstacle();
  }
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    dino.jump();
  }
});

loop();

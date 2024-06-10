let canvas = document.getElementById('mycanvas');
let ctx = canvas.getContext('2d');

let ballRadius = 10;
let x, y, dx, dy, paddleHeight, paddleWidth, paddleX, rightPressed, leftPressed, brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, score, bricks, particles, gameOver;

function init() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;  // Increased speed
    dy = -3; // Increased speed

    paddleHeight = 12;
    paddleWidth = 130;
    paddleX = (canvas.width - paddleWidth) / 2;

    rightPressed = false;
    leftPressed = false;

    brickRowCount = 6;  // Increased number of rows
    brickColumnCount = 10;  // Increased number of columns
    brickWidth = 72;
    brickHeight = 24;
    brickPadding = 12;
    brickOffsetTop = 32;
    brickOffsetLeft = 32;

    score = 0;
    gameOver = false;

    bricks = [];
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    particles = [];
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    }
    else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    }
    else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawTriangle(brickX, brickY) {
    ctx.beginPath();
    ctx.moveTo(brickX + brickWidth / 2, brickY); // Top point
    ctx.lineTo(brickX, brickY + brickHeight); // Bottom left point
    ctx.lineTo(brickX + brickWidth, brickY + brickHeight); // Bottom right point
    ctx.closePath();
    ctx.fill();
}

function drawBricks() {
    // Draw targets on the left side
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                if (c % 2 === 0) {
                    // Draw square bricks
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                } else {
                    // Draw triangle bricks
                    drawTriangle(brickX, brickY);
                }
                brickcolor(r);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    // Draw targets on the right side
    for (r = 0; r < brickRowCount; r++) {
        let brickX = canvas.width - brickOffsetLeft - brickWidth; // X-coordinate for right side targets
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        ctx.beginPath();
        if (r % 2 === 0) {
            // Draw square bricks
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
        } else {
            // Draw triangle bricks
            drawTriangle(brickX, brickY);
        }
        brickcolor(r); // Choose color for bricks
        ctx.fill();
        ctx.closePath();
    }
}


function brickcolor(x) {
    if (x === 0) {
        ctx.fillStyle = '#6600cc';
    }
    if (x === 1) {
        ctx.fillStyle = 'green';
    }
    if (x === 2) {
        ctx.fillStyle = 'green';
    }
    if (x === 3) {
        ctx.fillStyle = 'orange';
    }
}

function drawScore() {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('score: ' + score, 8, 20);
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; // Set status to 0 directly to break the brick
                    score++;
                    createParticles(b.x, b.y); // Create particles at the brick's position

                    // Other score-based conditions...

                    if (score === brickRowCount * brickColumnCount) {
                        alert('Congratulations!! You\'ve won!');
                        document.location.reload();
                    }

                    // Exit the loop after one collision
                    return;
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.life = 1.0; // Start with full opacity
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life -= 0.02; // Fade out effect
    }
}

function createParticles(x, y) {
    const colors = ['255, 0, 0', '0, 255, 0', '0, 0, 255', '255, 255, 0'];
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x + brickWidth / 2, y + brickHeight / 2, dx, dy, color));
    }
}

function drawParticles() {
    particles = particles.filter(p => p.life > 0);
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
}

function drawGameOverScreen() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '36px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText(' Score anda: ' + score, canvas.width / 2 - 100, canvas.height / 2 + 40);
    ctx.fillText('tekan enter untuk restart', canvas.width / 2 - 150, canvas.height / 2 + 80);
}

function draw() {
    if (gameOver) {
        drawGameOverScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
    drawParticles();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameOver = true;
            document.addEventListener('keydown', function restartGame() {
                document.removeEventListener('keydown', restartGame);
                init();
                gameOver = false;
            }, { once: true });
            return;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

init();
setInterval(draw, 10);

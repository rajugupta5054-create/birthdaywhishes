const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 6;

// Colors
const PADDLE_COLOR_1 = '#0ff'; // Cyan
const PADDLE_COLOR_2 = '#f0f'; // Magenta
const BALL_COLOR = '#fff';

// Game state
let score1 = 0;
let score2 = 0;
let gameStarted = false;

// Keys
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Objects
const player1 = {
    x: 30,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_COLOR_1,
    dy: 0
};

const player2 = {
    x: canvas.width - 30 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_COLOR_2,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    color: BALL_COLOR
};

// Event Listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') keys.w = true;
    if (e.key === 's' || e.key === 'S') keys.s = true;
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
    if (e.key === ' ' && !gameStarted) {
        gameStarted = true;
        resetBall();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') keys.w = false;
    if (e.key === 's' || e.key === 'S') keys.s = false;
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

// Functions
function drawRect(x, y, w, h, color, glowColor) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = glowColor;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0; // Reset
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([10, 15]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function updateScore() {
    score1El.innerText = score1;
    score2El.innerText = score2;
}

function update() {
    if (!gameStarted) return;

    // Move Player 1
    if (keys.w && player1.y > 0) player1.y -= PADDLE_SPEED;
    if (keys.s && player1.y + player1.height < canvas.height) player1.y += PADDLE_SPEED;

    // Move Player 2
    if (keys.ArrowUp && player2.y > 0) player2.y -= PADDLE_SPEED;
    if (keys.ArrowDown && player2.y + player2.height < canvas.height) player2.y += PADDLE_SPEED;

    // Move Ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball Wall Collision (Top & Bottom)
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    // Ball Paddle Collision
    // Player 1
    if (
        ball.x - ball.size < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height &&
        ball.dx < 0
    ) {
        ball.dx *= -1.05; // Slightly increase speed
    }

    // Player 2
    if (
        ball.x + ball.size > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height &&
        ball.dx > 0
    ) {
        ball.dx *= -1.05; // Slightly increase speed
    }

    // Scoring
    if (ball.x - ball.size < 0) {
        score2++;
        updateScore();
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        score1++;
        updateScore();
        resetBall();
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();
    
    // Draw Paddles
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color, player2.color);
    
    // Draw Ball
    if (gameStarted) {
        drawCircle(ball.x, ball.y, ball.size, ball.color);
    } else {
        ctx.fillStyle = '#fff';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE TO START', canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initial draw
draw();
gameLoop();

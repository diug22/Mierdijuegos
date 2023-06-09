function initGame() {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let posX = canvas.width / 2;
    let posY = canvas.height / 2;
    let direction = -1;
    const ballRadius = 10;
    const speed = 3;
    let score = 0;
    let bestScore = 0;
    let startTime = Date.now();
    let obstacles = [];
    let powerUps = [];
    let gameOver = false;

    function createObstacle() {
        const width = Math.random() * (canvas.width * 0.6) + (canvas.width * 0.1);
        const x = Math.random() * (canvas.width - width);
        const y = -20;
        obstacles.push({ x, y, width, height: 10 });
    }

    function createPowerUp() {
        const x = Math.random() * (canvas.width - 20);
        const y = -20;
        powerUps.push({ x, y, width: 20, height: 20 });
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(posX, posY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    function drawObstacles() {
        ctx.fillStyle = 'black';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function drawPowerUps() {
        ctx.fillStyle = 'gold';
        powerUps.forEach(powerUp => {
            ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        });
    }

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Puntuación: ' + score, 10, 20);
        ctx.fillText('Mejor puntuación: ' + bestScore, 10, 40);
    }

    function drawGameOver() {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);

        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Toca para reiniciar', canvas.width / 2 - 85, canvas.height / 2 + 50);
    }

    function resetGame() {
        posX = canvas.width / 2;
        posY = canvas.height / 2;
        score = 0;
        startTime = Date.now();
        obstacles = [];
        powerUps = [];
        gameOver = false;
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameOver) { drawGameOver(); } else { drawBall(); drawObstacles(); drawPowerUps(); drawScore();
                posX += direction * speed;

    if (posX < ballRadius || posX > canvas.width - ballRadius) {
        direction *= -1;
    }

    obstacles.forEach(obstacle => {
        obstacle.y += speed;

        // Comprobar colisión con obstáculos
        if (posX + ballRadius > obstacle.x && posX - ballRadius < obstacle.x + obstacle.width && posY + ballRadius > obstacle.y && posY - ballRadius < obstacle.y + obstacle.height) {
            if (score > bestScore) {
                bestScore = score;
            }
            gameOver = true;
        } else if (obstacle.y + obstacle.height > posY) {
            score++;
        }
    });

    powerUps.forEach((powerUp, index) => {
        powerUp.y += speed;

        // Comprobar colisión con power-ups
        if (posX + ballRadius > powerUp.x && posX - ballRadius < powerUp.x + powerUp.width && posY + ballRadius > powerUp.y && posY - ballRadius < powerUp.y + powerUp.height) {
            score += 100;
            powerUps.splice(index, 1);
        }
    });

    // Eliminar obstáculos y power-ups fuera de la pantalla
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    powerUps = powerUps.filter(powerUp => powerUp.y < canvas.height);

    // Crear nuevos obstáculos y power-ups
    if (Math.random() < 0.01) {
        createObstacle();
    }
    if (Math.random() < 0.005) {
        createPowerUp();
    }

    // Añadir puntos por tiempo
    score += Math.floor((Date.now() - startTime) / 10);
    startTime = Date.now();
    }

    requestAnimationFrame(updateGame);
    }

    function onTouch() {
    if (gameOver) {
    resetGame();
    } else {
    direction *= -1;
    }
    }

    canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    onTouch();
    });

    updateGame();
}
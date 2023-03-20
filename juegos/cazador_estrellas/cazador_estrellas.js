function initGame(){
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 30,
        height: 30
    };
    const stars = [];
    const asteroids = [];
    let score = 0;
    let gameOver = false;

    function drawPlayer() {
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawStars() {
        ctx.fillStyle = 'yellow';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, star.width, star.height);
        });
    }

    function drawAsteroids() {
        ctx.fillStyle = 'gray';
        asteroids.forEach(asteroid => {
            ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
        });
    }

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Puntuación: ' + score, 10, 20);
    }

    function drawGameOver() {
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);
    }

    function createStar() {
        const x = Math.random() * (canvas.width - 10);
        const y = -10;
        stars.push({ x, y, width: 10, height: 10 });
    }

    function createAsteroid() {
        const x = Math.random() * (canvas.width - 30);
        const y = -30;
        asteroids.push({ x, y, width: 30, height: 30 });
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameOver) {
            drawGameOver();
        } else {
            drawPlayer();
            drawStars();
            drawAsteroids();
            drawScore();

            stars.forEach((star, index) => {
                star.y += 2;

                if (player.x < star.x + star.width && player.x + player.width > star.x && player.y < star.y + star.height && player.y + player.height > star.y) {
                    score += 10;
                    stars.splice(index, 1);
                }
            });

            asteroids.forEach((asteroid, index) => {
                asteroid.y += 3;

                if (player.x < asteroid.x + asteroid.width && player.x + player.width > asteroid.x && player.y < asteroid.y + asteroid.height && player.y + player.height > asteroid.y) {
                    gameOver = true;
                }
            });

            stars.filter(star => star.y < canvas.height); asteroids.filter(asteroid => asteroid.y < canvas.height);
            
        if (Math.random() < 0.02) {
            createStar();
        }

        if (Math.random() < 0.01) {
            createAsteroid();
        }
    }

    requestAnimationFrame(updateGame);
}

function onTouch(e) {
    if (!gameOver) {
        const touchX = e.touches[0].clientX;
        if (touchX < player.x) {
            player.x -= 50;
        } else {
            player.x += 50;
        }

        if (player.x < 0) {
            player.x = 0;
        } else if (player.x > canvas.width - player.width) {
            player.x = canvas.width - player.width;
        }
    } else {
        resetGame();
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    stars.length = 0;
    asteroids.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 30;
}

canvas.addEventListener('touchstart', onTouch, false);
updateGame();
}
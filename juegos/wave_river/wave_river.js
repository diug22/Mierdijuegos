function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const surfer = {
        x: 50,
        y: 150,
        width: 30,
        height: 30,
        angle: 0
    };

    const wave = {
        height: 150,
        segments: [],
        speed: 0.01
    };

    const coins = [];
    const obstacles = [];

    let score = 0;
    let gameOver = false;

    function drawSurfer() {
        ctx.save();
        ctx.translate(surfer.x + surfer.width / 2, surfer.y + surfer.height / 2);
        ctx.rotate(surfer.angle);
        ctx.fillStyle = 'white';
        ctx.fillRect(-surfer.width / 2, -surfer.height / 2, surfer.width, surfer.height);
        ctx.restore();
    }

    function drawWave() {
        ctx.fillStyle = '#00BFFF';
        ctx.beginPath();
        ctx.moveTo(0, wave.height + wave.segments[0]);
        for (let i = 0; i < wave.segments.length - 1; i++) {
            ctx.quadraticCurveTo((i + 0.5) * canvas.width / wave.segments.length, wave.height + (wave.segments[i] + wave.segments[i + 1]) / 2, (i + 1) * canvas.width / wave.segments.length, wave.height + wave.segments[i + 1]);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    function drawCoin(coin) {
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.width / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawObstacle(obstacle) {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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

    function createWaveSegments() {
        for (let i = 0; i < 10; i++) {
            wave.segments.push(Math.random() * 30 - 15);
        }
    }

    function updateWaveSegments() {
        for (let i = 0; i < wave.segments.length; i++) {
            wave.segments[i] += Math.sin(i * 2 * Math.PI / wave.segments.length + Date.now() * wave.speed) * 0.5;
        }
    }

    function createObstacle() {
        const x = Math.random() * (canvas.width - 20) + 10;
        const y = surfer.y - 30 + Math.random() * 60;
        obstacles.push({ x, y, width: 10, height: 10, life: 300 });
    }
    
    function createCoin() {
        const x = Math.random() * (canvas.width - 10) + 10;
        const y = surfer.y - 20 + Math.random() * 40;
        coins.push({ x, y, width: 10, height: 10, life: 300 });
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }

    function onTouch(e) {
        if (!gameOver) {
            const touchX = e.touches[0].clientX;
            const deltaX = touchX - surfer.x;

            surfer.x += deltaX * 0.1;
            surfer.angle += deltaX * 0.001;
            if (surfer.angle < -Math.PI / 4) {
                surfer.angle = -Math.PI / 4;
            } else if (surfer.angle > Math.PI / 4) {
                surfer.angle = Math.PI / 4;
            }
        } else {
            resetGame();
        }
    }

    function resetGame() {
        gameOver = false;
        score = 0;
        coins.length = 0;
        obstacles.length = 0;
        surfer.x = 50;
        surfer.y = 150;
        surfer.angle = 0;
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateWaveSegments();
        updateSurfer();

        if (gameOver) {
            drawGameOver();
        } else {
            drawWave();
            drawSurfer();

            coins.forEach((coin, index) => {
                coin.life--;
                if (checkCollision(surfer, coin)) {
                    score++;
                    coins.splice(index, 1);
                } else  if (coin.x + coin.width < 0 || coin.life <= 0) {
                    coins.splice(index, 1);
                } else {
                    drawCoin(coin);
                }
            });

            obstacles.forEach((obstacle, index) => {
                if (checkCollision(surfer, obstacle)) {
                    gameOver = true;
                } else if (obstacle.x + obstacle.width < 0 || obstacle.life <= 0) {
                    obstacles.splice(index, 1);
                } else {
                    drawObstacle(obstacle);
                }
            });

            if (Math.random() < 0.01) {
                createCoin();
            }

            if (Math.random() < 0.02) {
                createObstacle();
            }

            drawScore();
        }

        requestAnimationFrame(updateGame);
    }
    function updateSurfer() {
        const segmentIndex = Math.floor(surfer.x * wave.segments.length / canvas.width);
        const segmentProgress = (surfer.x % (canvas.width / wave.segments.length)) / (canvas.width / wave.segments.length);
    
        const waveHeightAtSurfer = wave.height + wave.segments[segmentIndex] * (1 - segmentProgress) + wave.segments[segmentIndex + 1] * segmentProgress;
        surfer.y = waveHeightAtSurfer - surfer.height / 2;
    
        const slope = (wave.segments[segmentIndex + 1] - wave.segments[segmentIndex]) * canvas.width / wave.segments.length;
        const angleFromSlope = Math.atan(slope / canvas.width * wave.segments.length);
    
        surfer.angle = angleFromSlope;

        if (surfer.x > canvas.width - surfer.width) {
            surfer.x = canvas.width - surfer.width;
        }
    }

    createWaveSegments();
    canvas.addEventListener('touchstart', onTouch, false);
    updateGame();
}


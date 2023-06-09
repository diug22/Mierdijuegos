function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let colors = [];
    let oddColorIndex = 0;
    let gridSize = 3;
    let score = 0;
    let timer = 10000;
    let gameInProgress = true;
    let gameOver = false;

    function generateColors() {
        const baseColor = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };

        const colorVariation = 20;

        for (let i = 0; i < gridSize * gridSize; i++) {
            colors[i] = {
                r: baseColor.r + Math.floor(Math.random() * colorVariation) - colorVariation / 2,
                g: baseColor.g + Math.floor(Math.random() * colorVariation) - colorVariation / 2,
                b: baseColor.b + Math.floor(Math.random() * colorVariation) - colorVariation / 2
            };
        }

        oddColorIndex = Math.floor(Math.random() * gridSize * gridSize);
        colors[oddColorIndex] = {
            r: baseColor.r + colorVariation+10,
            g: baseColor.g + colorVariation+10,
            b: baseColor.b + colorVariation+10 
        };
        
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cellWidth = canvas.width / gridSize;
        const cellHeight = canvas.height / gridSize;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const color = colors[i * gridSize + j];
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    function checkCorrectColor(index) {
        if (index === oddColorIndex) {
            score++;
            gridSize = Math.min(8, gridSize + 1);
            timer = timer+1000
            generateColors();
        } else {
            
        gameInProgress  = false;
        }
    }

    function handleClick(event) {
        if (!gameInProgress) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const cellWidth = canvas.width / gridSize;
        const cellHeight = canvas.height / gridSize;

        const i = Math.floor(y / cellHeight);
        const j = Math.floor(x / cellWidth);
        const index = i * gridSize + j;
        console.log(index)

        checkCorrectColor(index);
    }

    let elapsedTime = 0;

    function update() {

    elapsedTime += 1000 / 60;

    if (gameInProgress) {
    draw();

    // Dibujar el temporizador en la pantalla
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const remainingTime = ((timer - elapsedTime) / 1000).toFixed(1);
    ctx.fillText('Tiempo restante: ' + remainingTime + 's', 10, 30);

    ctx.fillText('Puntuación: ' + score, 10, 60);

    if (elapsedTime >= timer) {
        gameInProgress = false;
    }
    } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    gameOver = true;
    }
    }

    function resetGame() {
    if (!gameInProgress && gameOver) {
    score = 0;
    gridSize = 3;
    elapsedTime = 0;
    timer = 10000;
    gameInProgress = true;
    gameOver = false;
    generateColors();
    }
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('click', resetGame);

    generateColors();
    setInterval(update, 1000 / 60);
}

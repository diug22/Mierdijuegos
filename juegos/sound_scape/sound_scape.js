
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameOver = false

class Player {

    constructor(x, y, maze) {
        this.x = x;
        this.y = y;
        this.maze = maze;
    }
   
    draw() {
        /*const cellWidth = canvas.width / this.maze.width;
        const cellHeight = canvas.height / this.maze.height;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight);*/
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        if (this.x == 0 && this.y == 1){
                ctx.font = '48px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText('Ganaste!', canvas.width / 2 - 100, canvas.height / 2 - 50);
                gameOver = true
        }
    }
}

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.mazeData = this.generateMaze();
    }

    generateMaze() {
        // Crear un laberinto vacío lleno de paredes
        const maze = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => 1));
    
        // Definir una función para obtener vecinos aleatorios
        function randomNeighbor(x, y, visited) {
            const neighbors = [
                [x - 2, y],
                [x + 2, y],
                [x, y - 2],
                [x, y + 2]
            ].filter(([nx, ny]) => {
                return (
                    nx >= 0 &&
                    ny >= 0 &&
                    nx < maze[0].length &&
                    ny < maze.length &&
                    !visited[ny][nx]
                );
            });
    
            if (neighbors.length) {
                return neighbors[Math.floor(Math.random() * neighbors.length)];
            } else {
                return null;
            }
        }
    
        // Implementar el algoritmo de Prim
        const visited = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => false));
        const stack = [[1, 1]];
    
        visited[1][1] = true;
        maze[1][1] = 0;
    
        while (stack.length) {
            const [x, y] = stack[stack.length - 1];
            const neighbor = randomNeighbor(x, y, visited);
    
            if (neighbor) {
                const [nx, ny] = neighbor;
                const dx = nx - x;
                const dy = ny - y;
    
                maze[ny][nx] = 0;
                maze[y + dy / 2][x + dx / 2] = 0;
                visited[ny][nx] = true;
    
                stack.push([nx, ny]);
            } else {
                stack.pop();
            }
        }
    
        // Crear entrada y salida
        maze[1][0] = 0;
        
    
        return maze;
    }

    draw() {
        const cellWidth = canvas.width / this.width;
        const cellHeight = canvas.height / this.height;
        ctx.fillStyle = 'black';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.mazeData[i][j] === 1) {
                    ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }
    

    isPositionValid(x, y) {
        return (
            x >= 0 &&
            y >= 0 &&
            this.mazeData[y][x] === 0
        );
    }
}

// inputHandler.js

class InputHandler {
    constructor(player, maze) {
        this.player = player;
        this.maze = maze;
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchEndHandler = this.touchEndHandler.bind(this);
        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.attachListeners();
    }

    attachListeners() {
        const options = { passive: false }; // Añade esta línea
        window.addEventListener('touchstart', this.touchStartHandler, options); // Modifica esta línea
        window.addEventListener('touchend', this.touchEndHandler, options); // Modifica esta línea
    }
    

    detachListeners() {
        window.removeEventListener('touchstart', this.touchStartHandler);
        window.removeEventListener('touchend', this.touchEndHandler);
    }

    touchStartHandler(event) {
        if (!gameOver) {
            event.preventDefault();
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
            playAudioHint(this.player, this.maze);
        }
        else {
            gameOver = false
            
        }
    }

    touchEndHandler(event) {
        event.preventDefault();
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                if(this.maze.isPositionValid(this.player.x+1,this.player.y)){
                    this.player.move(1, 0);
                }
            } else {
                if(this.maze.isPositionValid(this.player.x-1,this.player.y)){
                    this.player.move(-1, 0);
                }
            }
        } else {
            if (deltaY > 0) {
                if(this.maze.isPositionValid(this.player.x,this.player.y+1)){
                    this.player.move(0, 1);
                }
            } else {
                if(this.maze.isPositionValid(this.player.x,this.player.y-1)){
                    this.player.move(0, -1);
                }
            }
        }
        
    }
}

function aStar(maze, start, goal) {
    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function reconstructPath(cameFrom, current) {
        const path = [current];
        while (posToStr(current) in cameFrom) {
            current = cameFrom[posToStr(current)];
            path.push(current);
        }
        return path.reverse();
    }

    function posToStr(pos) {
        return `${pos.x},${pos.y}`;
    }

    const openSet = [start];
    const cameFrom = {};

    const gScore = {};
    gScore[posToStr(start)] = 0;

    const fScore = {};
    fScore[posToStr(start)] = heuristic(start, goal);

    while (openSet.length > 0) {
        let current = openSet.reduce((prev, curr) => (fScore[posToStr(prev)] < fScore[posToStr(curr)] ? prev : curr));

        if (current.x === goal.x && current.y === goal.y) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(openSet.indexOf(current), 1);

        const neighbors = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
        ].filter((n) => maze.isPositionValid(n.x, n.y));

        for (const neighbor of neighbors) {
            const tentativeGScore = gScore[posToStr(current)] + 1;

            if (!(posToStr(neighbor) in gScore) || tentativeGScore < gScore[posToStr(neighbor)]) {
                cameFrom[posToStr(neighbor)] = current;
                gScore[posToStr(neighbor)] = tentativeGScore;
                fScore[posToStr(neighbor)] = tentativeGScore + heuristic(neighbor, goal);

                if (!openSet.some((os) => os.x === neighbor.x && os.y === neighbor.y)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}


 
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function playAudioHint(player, maze) {
    // Crear una instancia de AudioContext
    initAudioContext();

    // Definir la posición de salida en el laberinto
    const exitPosition = {
        x: 0,
        y: 1
    };

    // Calcular la distancia y la dirección hacia la salida usando el algoritmo A* para obtener el camino más corto
    const path = aStar(maze, player, exitPosition);
    const distance = path.length;

    // Definir una escala cromática con múltiples octavas (frecuencias en Hz)
    const scale = [
        130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94,
        261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
        523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77
    ];

    // Calcular el índice de la escala basado en la distancia
    const scaleIndex = Math.min(distance, scale.length - 1);

    // Crear un oscilador y establecer su frecuencia según el índice de la escala
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = scale[scaleIndex];

    // Establecer el tipo de onda del oscilador
    oscillator.type = 'sine';

    // Crear un nodo de ganancia (volumen) y aplicar una envolvente ADSR
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Inicialmente en silencio
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01); // Attack
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.1); // Decay
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.3); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5); // Release

    // Conectar el oscilador al nodo de ganancia y al destino de audio
     oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar el oscilador
    oscillator.start();

    // Detener el oscilador después de un corto período de tiempo
    setTimeout(() => {
        oscillator.stop();
    }, 500);
}


function initGame() {
    const mazeWidth = Math.floor(canvas.width / 80) * 2 + 1;
    const mazeHeight = Math.floor(canvas.height / 80) * 2 + 1;
    const maze = new Maze(mazeWidth, mazeHeight);

    function findStartPosition(maze) {
        let suitablePositions = [];

        for (let i = 1; i < maze.height - 1; i++) {
            for (let j = 1; j < maze.width - 1; j++) {
                if (maze.mazeData[i][j] === 0) {
                    const distance = Math.sqrt(
                        Math.pow(maze.width - 2 - j, 2) + Math.pow(maze.height - 1 - i, 2)
                    );
                    if (distance > 10 && distance < 50) {
                        suitablePositions.push({ x: j, y: i, distance: distance });
                    }
                }
            }
        }

        if (suitablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * suitablePositions.length);
            return { x: suitablePositions[randomIndex].x, y: suitablePositions[randomIndex].y };
        } else {
            return { x: 1, y: 1 };
        }
    }

    const startPosition = findStartPosition(maze);
    const player = new Player(startPosition.x, startPosition.y, maze);
    new InputHandler(player, maze);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        maze.draw();
        player.draw();
    }

    function update() {
        if(!gameOver) {
            draw();
        }
    }


    setInterval(update, 1000 / 60);
}
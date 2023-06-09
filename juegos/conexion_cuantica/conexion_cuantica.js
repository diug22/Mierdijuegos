function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const qubits = generateRandomQubits(5);


    const connections = [];

    let selectedQubit = null;
    let dragging = false;
    let gameOver = false;
    let touchEnd = { x: 0, y: 0 };

    function drawQubits() {
        ctx.fillStyle = 'white';
        qubits.forEach(qubit => {
            ctx.beginPath();
            ctx.arc(qubit.x, qubit.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    
function restartGame() {
qubits.length = 0;
connections.length = 0;
gameOver = false;
qubits.push(...generateRandomQubits(5));
}

    function drawConnections() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        connections.forEach(connection => {
            ctx.beginPath();
            ctx.moveTo(qubits[connection.start].x, qubits[connection.start].y);
            ctx.lineTo(qubits[connection.end].x, qubits[connection.end].y);
            ctx.stroke();
        });
    }

    function drawPreviewConnection(x, y) {
        if (selectedQubit !== null) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(qubits[selectedQubit].x, qubits[selectedQubit].y);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            drawQubits();
            drawConnections();
            if (dragging) {
                drawPreviewConnection(touchEnd.x, touchEnd.y);
            }
        } else {
            ctx.font = '48px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText('Ganaste!', canvas.width / 2 - 100, canvas.height / 2 - 50);
        }

        requestAnimationFrame(updateGame);
    }

    
    function onTouchStart(event) {
event.preventDefault();

if (gameOver) {
    restartGame();
    return;
}

const touch = event.changedTouches[0];
const x = touch.clientX - canvas.getBoundingClientRect().left;
const y = touch.clientY - canvas.getBoundingClientRect().top;

selectedQubit = findClosestQubit(x, y);

if (selectedQubit !== null) {
    dragging = true;
}
}

    function checkWin() {
const totalConnections = qubits.length * (qubits.length - 1) / 2;
if (connections.length === totalConnections) {
    gameOver = true;
}
}


    function onTouchMove(event) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        touchEnd.x = touch.clientX - canvas.getBoundingClientRect().left;
        touchEnd.y = touch.clientY - canvas.getBoundingClientRect().top;
    }

    function onTouchEnd(event) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        const x = touch.clientX - canvas.getBoundingClientRect().left;
        const y = touch.clientY - canvas.getBoundingClientRect().top;

        const targetQubit = findClosestQubit(x, y);

        if (selectedQubit !== null && targetQubit !== null && targetQubit !== selectedQubit && !connectionExists(selectedQubit, targetQubit)) {
            connections.push({ start: selectedQubit, end: targetQubit });
            checkWin();
        }

        selectedQubit = null;
        dragging = false;
    }
    function generateRandomQubits(numQubits) {
const newQubits = [];
for (let i = 0; i < numQubits; i++) {
    newQubits.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
    });
}
return newQubits;
}


    function findClosestQubit(x, y) {
        let closest = null;
        let closestDistance = Infinity;

        qubits.forEach((qubit, index) => {
            const dx = qubit.x - x;
            const dy = qubit.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20 && distance < closestDistance) {
                closest = index;
                closestDistance = distance;
            }
        });

        return closest;
    }

    function connectionExists(qubitA, qubitB) {
        return connections.some(connection => (connection.start === qubitA && connection.end === qubitB) || (connection.start === qubitB && connection.end === qubitA));
    }

    canvas.addEventListener('touchstart', onTouchStart, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
    canvas.addEventListener('touchend', onTouchEnd, false);

    updateGame();
}

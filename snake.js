const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameOver = document.querySelector('.gameOver');
const score = document.querySelector('.score__digit');
const highestScore = document.querySelector('.highestScore__digit');

// Counting best result
let scoreCounting = 0;


let highestScoreSet = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;

let highestScorePlayer = localStorage.get

highestScore.textContent = highestScoreSet;

function highestScorecount() {
    if (scoreCounting > highestScoreSet) {
        highestScoreSet = scoreCounting;
        highestScore.textContent = highestScoreSet;
        localStorage.setItem('highestScore', highestScoreSet);
    }
}

// Sukuriame gyvatės segmentų masyvą
let squareSize = 30;
let gameInterval;

const snake = [
    { x: 210, y: 210 },
    { x: 180, y: 210 },
    { x: 150, y: 210 },
    { x: 120, y: 210 },
    { x: 90, y: 210 }
];

let food = startingFood();

function generateRandomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize,
        y: Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize
    };
}

function foodOnSnake(food, snake) {
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];
        if (food.x === segment.x && food.y === segment.y) {
            return true;
        }
    }
    return false;
}

function startingFood() {
    let newFood;
    for (let i = 0; i < 100; i++) {
        newFood = generateRandomFood();
        if (!foodOnSnake(newFood, snake)) {
            return newFood;
        }
    }
    return newFood;
}

function genFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        scoreCounting += 1;
        score.textContent = scoreCounting;
        food = startingFood();
        let lastSegment = snake[snake.length - 1];
        let newSegment = { x: lastSegment.x, y: lastSegment.y };
        snake.push(newSegment);
    }
}

const foodImage = new Image()
foodImage.src = 'img/food.png'

function drawFood() {
    ctx.drawImage(foodImage, food.x, food.y, squareSize, squareSize);
}


function snakeTail(snake) {
    const snakeHead = snake[0];
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        if (snakeHead.x === segment.x && snakeHead.y === segment.y) {
            // alert('atsitrenke');
            clearInterval(gameInterval);
            reset();
        }
    }
}

function snakePart(drawSnake) {
    ctx.fillStyle = 'rgb(161 105 56)';
    ctx.fillRect(drawSnake.x, drawSnake.y, 30, 30);
    // ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(drawSnake.x, drawSnake.y, 30, 30);
}

function loopSnakeParts(snakeTail) {
    for (let i = 0; i < snakeTail.length; i++) {
        snakePart(snakeTail[i]);
    }
}

let dx = 0;
let dy = 0;

function snakeMovement() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (dx !== 0 || dy !== 0) {
        snake.pop();
    }
}

function snakeHitWall() {
    if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= canvas.width || snake[0].y >= canvas.height) {
        clearInterval(gameInterval);
        reset();
        dx = 0;
        dy = 0;
        gameOver.style.display = 'block';
    }
}

function reset() {
    highestScorecount();
    scoreCounting = 0;
    snake.length = 0;
    snake.push({ x: 210, y: 210 }, { x: 180, y: 210 }, { x: 150, y: 210 }, { x: 120, y: 210 }, { x: 90, y: 210 });
    food = startingFood();
    initialDraw();
    gameStarted = false;
}

let gameStarted = false;

document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        gameStarted = true;
        runGame();
    }
    const button = event.key;
    if (button === 'ArrowUp' && dy === 0) {
        dy = -30;
        dx = 0;
    } else if (button === 'ArrowDown' && dy === 0) {
        dy = 30;
        dx = 0;
    } else if (button === 'ArrowLeft' && dx === 0) {
        dx = -30;
        dy = 0;
    } else if (button === 'ArrowRight' && dx === 0) {
        dx = 30;
        dy = 0;
    }
});

function initialDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    loopSnakeParts(snake);
}

// snake speed

let currentSpeed = 300
let lastSpeedIncreaseScore = 0

function checkSpeed() {
    if (scoreCounting > 0 && scoreCounting % 5 === 0 && scoreCounting !== lastSpeedIncreaseScore) {
        // alert('sss')
        currentSpeed -= 30
            // if (currentSpeed <= 100) {
            //     currentSpeed = 100
            // }
        lastSpeedIncreaseScore = scoreCounting
        clearInterval(gameInterval)
        runGame()
    }
}


function runGame() {
    gameInterval = setInterval(() => {
        score.textContent = scoreCounting;
        gameOver.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        snakeMovement();
        genFood();
        snakeHitWall();
        snakeTail(snake);
        loopSnakeParts(snake);
        checkSpeed()
    }, currentSpeed);
}

initialDraw();
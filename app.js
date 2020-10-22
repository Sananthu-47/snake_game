window.onload = ()=>{

    document.querySelector('.loading-page').style.display='none';
    document.querySelector('.game-container').style.display='block';

    const cvs = document.getElementById('canvas');
    const ctx = cvs.getContext("2d");
    let cWidth = cvs.width = 800;
    let cHeight = cvs.height = 800;
    let box = 40;
    let loopMax=20;
    let lG = "#ccff90";
    let dG = "#b2ff70";
    let score = 0;
    const gameBorder = document.getElementById('border');
    const overlay = document.querySelector('.overlay');
    const scoreShow = document.getElementById('score');
    const controller = document.querySelector('.controller');
    const foodImage = new Image();

    const foods = ['images/apple.png','images/cherry.png','images/orange.png'];
    foodImage.src=foods[randomNumber(foods.length)];

    const wWidth=window.innerWidth;
    const wHeight=window.innerHeight;

    if(wWidth<=300||wHeight<=300)
    {
        cWidth=cvs.width=200;
        cHeight=cvs.height=200;
        gameBorder.style.width=cWidth+"px";
        box=20;
        loopMax=10;
    }else
    if(wWidth<=400||wHeight<=400)
    {
        cWidth=cvs.width=300;
        cHeight=cvs.height=300;
        gameBorder.style.width=cWidth+"px";
        controller.style.position='relative';
        controller.style.top='30px';
        box=30;
        loopMax=10;
    }else
    if(wWidth<=600||wHeight<=600)
    {
        cWidth=cvs.width=400;
        cHeight=cvs.height=400;
        box=40;
        loopMax=10;
    }else
    if(wWidth<=800||wHeight<=800)
    {
        cWidth=cvs.width=400;
        cHeight=cvs.height=400;
        gameBorder.style.width=cWidth+"px";
        box=40;
        loopMax=10;
    }else
    {
        cWidth=cvs.width=800;
        cHeight=cvs.height=800;
        gameBorder.style.width=cWidth+"px";
        box=40;
        loopMax=20;
        controller.style.display='none';
    }


    function randomNumber(max)
    {
        return Math.floor(Math.random()*max);
    }


    class Tile {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        createBlock(color) {
            ctx.fillStyle = color;
            ctx.fillRect(this.x * box, this.y * box, box, box);
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x * box, this.y * box, box, box);
        }
    }

    let newTile;
    //Create the grid of the game board
    function drawTile() {
        for (let i = 0; i < loopMax; i++) {
            if (i % 2 !== 0) {
                dG = "#ccff90";
                lG = "#b2ff70";
            } else {
                lG = "#ccff90";
                dG = "#b2ff70";
            }
            for (let j = 0; j < loopMax; j++) {
                newTile = new Tile(j, i);
                if (j % 2 == 0) {
                    newTile.createBlock(dG);
                } else {
                    newTile.createBlock(lG);
                }
            }
        }
    }


    //Create snake
    let snakes = [];
    let direction = "right";
    let gameStatus = false;
    let food = {
        x: Math.floor(Math.random() * ((loopMax-1) - 1 + 1) + 1),
        y: Math.floor(Math.random() * ((loopMax-1) - 1 + 1) + 1)
    }

    let snakeLen = 4;

    function drawSnake(x, y, color, colorB) {
        ctx.fillStyle = color;
        ctx.fillRect(x * box, y * box, box, box);
        ctx.strokeStyle = colorB;
        ctx.strokeRect(x * box, y * box, box, box);
    }

    function drawFood(x, y) {
        ctx.drawImage(foodImage, x * box, y * box, box, box);
    }

    function addSnakeTile()
    {
        for (let i = snakeLen - 1; i >= 0; i--) {
            snakes.push({
                x: i,
                y: 0
            });
        }
    }
addSnakeTile();

//Function for snake
function draw() {
    let snakeX = snakes[0].x;
    let snakeY = snakes[0].y;

    for (let i = 0; i < snakes.length; i++) {
        let X = snakes[i].x;
        let Y = snakes[i].y;
        if (i == 0) {
            color = "yellow";
            colorB = "black";
        } else {
            color = "white"
            colorB = "red";
        }
        drawSnake(X, Y, color, colorB);
    }
    drawFood(food.x, food.y);

    if (gameStatus === true) {
        gameStart(snakeX, snakeY);
    }
}

function gameStart(snakeX, snakeY) {
    if (direction == "left") {
        snakeX--;
    } else
    if (direction == "up") {
        snakeY--;
    } else
    if (direction == "right") {
        snakeX++;
    } else
    if (direction == "down") {
        snakeY++;
    }

    if (snakeX == food.x && snakeY == food.y) {
        food = {
            x: Math.floor(Math.random() * ((loopMax-1) - 1 + 1) + 1),
            y: Math.floor(Math.random() * ((loopMax-1) - 1 + 1) + 1)
        }
        scoreShow.innerText = score += 1;
        foodImage.src=foods[randomNumber(foods.length)];
        if(snakes.includes(food.x))
{
    food.x=Math.floor(Math.random() * ((loopMax-1) - 1 + 1) + 1);
    console.log(food.x)
}
    } else {
        snakes.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }
    snakes.unshift(newHead);
    movement(newHead);

    if (collision(newHead)) {
        stopTimer();
        newStart();
    }
}

function newStart()
{
    overlay.style.display='flex';
        document.querySelector('.scored').innerText=score;
        document.querySelector('.score-modal').addEventListener('click',()=>{
            overlay.style.display='none';
            snakes=[];
            addSnakeTile();
            score=0;
            scoreShow.innerText=score;
            gameStatus=false;
           //stratTimer();
           location.reload();
        });
}


function collision(head) {
    for (let i = 1; i < snakes.length; i++) {
        if (head.x == snakes[i].x && head.y == snakes[i].y) {
            return true;
        }
    }
    return false;
}

function movement(head) {
    if (head.y * box >= cHeight) {
        return head.y = 0;
    }
    if (head.x * box >= cWidth) {
        return head.x = 0;
    }
    if (head.y < 0) {
        return head.y = cHeight/box;
    }
    if (head.x < 0) {
        return head.x = cWidth/box;
    }
}

//Function for cases

document.addEventListener('keyup', (e) => {
    if (e.keyCode == 37 && direction != "right") {
        direction = "left";
        gameStatus = true;
    } else
    if (e.keyCode == 38 && direction != "down") {
        direction = "up";
        gameStatus = true;
    } else
    if (e.keyCode == 39 && direction != "left") {
        direction = "right";
        gameStatus = true;
    } else
    if (e.keyCode == 40 && direction != "up") {
        direction = "down";
        gameStatus = true;
    }
});

//Function for cases (mobile)

document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('up') && direction != "down")
    {
        direction="up";  
        gameStatus=true;      
    }else
    if(e.target.classList.contains('left') && direction != "right")
    {
        direction="left";
        gameStatus=true;
    }else
    if(e.target.classList.contains('right') && direction != "left")
    {
        direction="right";
        gameStatus=true;
    }else
    if(e.target.classList.contains('bottom') && direction != "up")
    {
        direction="down";   
        gameStatus=true;     
    }
});

    function loop() {
        ctx.clearRect(0, 0, cWidth, cHeight);
        drawTile();
        draw();
    }

    const time = 100;
    let timer;

    function stratTimer()
    {
     timer = setInterval(loop, time);
    }
    stratTimer();

    function stopTimer() {
        clearInterval(timer);
    }

}
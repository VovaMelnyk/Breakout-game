
function Game (){
  this.canvas = document.getElementById('canvasGame');
  this.canvasContext = this.canvas.getContext ('2d');
  this.FPS = 60;
  this.ballX = this.canvas.width / 2;
  this.ballY = this.canvas.height - 20;
  this.ballSpeedX = 2;
  this.ballSpeedY = 4;
  this.PADDLE__WIDTH = 75;
  this.PADDLE__HEIGHT = 10;
  this.paddleX = (this.canvas.width - this.PADDLE__WIDTH) / 2;
  this.rightKeyPressed = false;
  this.leftKeyPressed = false;
  this.brickOffsetTop = 30;
  this.brickOffsetLeft = 30;
  this.brickPadding = 10;
  this.brickHeight = 20;
  this.brickWidth = 75;
  this.columnCount = 5;
  this.rowsCount = 3;
  this.score = 0;
  this.lives = 3;
}

Game.prototype.drawElement = function (color, posX, posY, width, height) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.fillRect(posX, posY, width, height);
};

Game.prototype.drawBall = function (color, centerX, centerY, radius) {
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = color;
    this.canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    this.canvasContext.fill();
    this.canvasContext.closePath()
};

Game.prototype.drawText = function (color, text, posX, posY) {
    this.canvasContext.font = '16px Arial';
    this.canvasContext.fillStyle = color;
    this.canvasContext.fillText(text, posX, posY);
};

Game.prototype.createBricksMatrix = function () {
    this.bricksArr = [];
    for (var r = 0; r < this.rowsCount; r++) {
        this.bricksArr[r] = [];
        for (var c = 0; c < this.columnCount; c++) {
            this.bricksArr[r][c] = {
                x: c,
                y: r,
                status: true
            }
        }
    }
};

Game.prototype.drawBrick = function () {
    // draw bricks columns
    for (var r = 0; r < this.rowsCount; r++) {
        // draw bricks rows
        for (var c = 0; c < this.columnCount; c++) {
            // draw bricks if they exist
            if (this.bricksArr[r][c].status === true) {
                var brickX = c * (this.brickPadding + this.brickWidth) + this.brickOffsetLeft;
                var brickY = r * (this.brickPadding + this.brickHeight) + this.brickOffsetTop;
                this.bricksArr[r][c].x = brickX;
                this.bricksArr[r][c].y = brickY;
                this.drawElement('#0095DD', brickX, brickY, this.brickWidth, this.brickHeight);
            }
        }
    }
};

Game.prototype.draw = function () {
    this.drawElement('#eee', 0, 0, this.canvas.width, this.canvas.height);

    if (this.score === this.rowsCount * this.columnCount) {
    this.drawText('#0095DD', 'You Win', this.canvas.width / 2 - 20, this.canvas.height / 2);
    return;
  }
   if (this.lives <= 0) {
    this.drawText('#0095DD', 'You Lose. Try again', this.canvas.width / 2 - 80, this.canvas.height / 2);
    return;
  }

    this.drawBall('#0095DD', this.ballX, this.ballY, 10);
    this.drawElement('#0095DD', this.paddleX, this.canvas.height - this.PADDLE__HEIGHT, this.PADDLE__WIDTH, this.PADDLE__HEIGHT );
    this.drawBrick();
    // draw score
    this.drawText('#0095DD', 'Score: '+ this.score, 8, 20 );
    // draw lives
    this.drawText('#0095DD', 'Lives: '+ this.lives, this.canvas.width - 68, 20)
};

Game.prototype.reset = function () {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - 40;
    this.paddleX = (this.canvas.width - this.PADDLE__WIDTH) / 2;
    this.ballSpeedY = -this.ballSpeedY;
    this.lives--;
};

Game.prototype.moveAll = function () {

    // launch ball
    this.ballY -= this.ballSpeedY;
    this.ballX += this.ballSpeedX;

    // bounced from left or right sides game`s screen
  if (this.ballX > this.canvas.width - 10 || this.ballX < 10) {
      this.ballSpeedX = -this.ballSpeedX;
  }

  // bounced from bottom of game`s screen
  if (this.ballY > this.canvas.height - 10) {
    // bounced from control paddle
    if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.PADDLE__WIDTH) {
        this.ballSpeedY = -this.ballSpeedY;
    } else {
        this.reset();
    }
    // bounced from top of game`s screen
  } else if (this.ballY < 10) {
      this.ballSpeedY = -this.ballSpeedY;
  }

  // right move control paddle on keyboard pressed right arrow
  if (this.rightKeyPressed && this.paddleX < this.canvas.width - this.PADDLE__WIDTH) {
      this.paddleX +=7;
  }
  // left move control paddle on keyboard pressed left arrow
  if (this.leftKeyPressed && this.paddleX > 0 ) {
      this.paddleX -=7
  }

  // collision detection
  for (var r = 0; r < this.rowsCount; r++) {
    for (var c = 0; c < this.columnCount; c++) {
        // check if brick exist change ballSpeedY and brick status
      if (this.bricksArr[r][c].status === true) {
        if (this.ballX >= this.bricksArr[r][c].x && this.ballX <= this.bricksArr[r][c].x + this.brickWidth
          && this.ballY >= this.bricksArr[r][c].y && this.ballY <= this.bricksArr[r][c].y + this.brickHeight) {
            this.ballSpeedY = -this.ballSpeedY;
            this.bricksArr[r][c].status = false;
            this.score++;
        }
      }
    }
  }
};

Game.prototype.handleKeyDown = function (e) {
    if (e.keyCode === 39) {
        this.rightKeyPressed = true;
    } else if (e.keyCode === 37) {
        this.leftKeyPressed = true;
    }
};

Game.prototype.handleKeyUp = function (e) {
    if (e.keyCode === 39) {
        this.rightKeyPressed = false;
    } else if (e.keyCode === 37) {
        this.leftKeyPressed = false;
    }
};

Game.prototype.handlerMouseMove = function (e) {
    var mouseX = e.clientX - this.canvas.offsetLeft;
    if (mouseX > this.PADDLE__WIDTH / 2 && mouseX < this.canvas.width - this.PADDLE__WIDTH / 2) {
        this.paddleX = mouseX - this.PADDLE__WIDTH / 2
    }
};

Game.prototype.start = function () {
    this.createBricksMatrix();
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    document.addEventListener('mousemove', this.handlerMouseMove.bind(this));
    setInterval(function () {
        this.draw();
        this.moveAll();
    }.bind(this), 1000/this.FPS);

};


var game = new Game();

game.start();



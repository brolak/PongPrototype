//initialize vars
var canvas;
var ctx;

//paddles position & size
var paddle1Y;
var PADDLE_HEIGHT = 80;
var PADDLE_WIDTH = 10;
var paddle2Y = 100;

//initial ball speed & position
var ballX;
var ballY;
var ballSpeedX = 10;
var ballSpeedY = 10;

//score and win condition
var WINNING_SCORE = 3;
var winScreen = false;
var player1Score = 0;
var player2Score = 0;

//function for getting mouse position for controlling
//player paddle
function getMousePos (evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	}
}

//function for clicking to restart game after win
function handleMouseClick (evt) {
	if(winScreen){
		player1Score = 0;
		player2Score = 0;
		winScreen = false;
	}
}


window.onload = function() {
	//setting canvas after initial page load
	canvas = document.getElementById('playCanvas');
	ctx = canvas.getContext('2d');

	//frames per second
	var fps = 30;
	ballReset();

	//game loop
	setInterval(function(){
		moveEverything();
		drawEverything();
	},1000/fps);

	//set listeners
	canvas.addEventListener('mousedown',handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt){
			var mousePos = getMousePos(evt);
			paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
		})
}

function ballReset() {
	//reset ball position or speed after score or win
	if(player1Score == WINNING_SCORE){
		winScreen = true;
		ctx.fillStyle = "white";
		ctx.fillText('Left Player Won!',100,200);
	} else if(player2Score === WINNING_SCORE){
		winScreen = true;
		ctx.fillStyle = "white";
		ctx.fillText('Right Player Won!',500,200);
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function aiMovement() {
	//movement of computer controlled paddle
	var aiSpeed = 8;
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY-30){
		paddle2Y += aiSpeed;
	} else if (paddle2YCenter > ballY+30){
		paddle2Y -= aiSpeed;
	}
}

function moveEverything() {
	//overall update of positions
	if(winScreen){
		return;
	}

	aiMovement();

	//ball movement
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	//left side collision
	if(ballX<=0){
		player2Score++;
		ballReset();
	}

	//left paddle collision
	if(ballX == PADDLE_WIDTH && ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
		var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
		ballSpeedX = -ballSpeedX;
		ballSpeedY = deltaY*0.35;
	}

	//right side collision
	if(ballX>=canvas.width){
		player1Score++;
		ballReset();
	}

	//right paddle collision
	if(ballX == canvas.width-PADDLE_WIDTH && ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
		var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
		ballSpeedX = -ballSpeedX;
		ballSpeedY = deltaY*0.35;
	}

	//top & bottom collision
	if(ballY<0 || ballY>canvas.height){
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	//draw the middle pong net
	for(i=0;i<canvas.height;i+=40){
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

function drawEverything() {
	//render all game objects
	if(winScreen){
		return;
	}
	
	//black background
	colorRect(0,0,canvas.width,canvas.height,'black');

	//white ball
	colorCircle(ballX,ballY,10,'white');

	drawNet();

	//white paddle (player)
	colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

	//white paddle (enemy)
	colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

	//display score
	ctx.fillText(player1Score,100,100);
	ctx.fillText(player2Score,canvas.width-100,100)
}

//function for drawing a circle shape on canvas
function colorCircle(centerX,centerY,radius,color){
	ctx.fillstyle = color;
	ctx.beginPath();
	ctx.arc(centerX,centerY,radius,0,Math.PI*2,true);
	ctx.fill();
}

//function for drawing a rectangle shape on canvas
function colorRect(topLeftX,topLeftY,width,height,color){
	ctx.fillStyle = color;
	ctx.rect(topLeftX,topLeftY,width,height);
	ctx.fill();
}
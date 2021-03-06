var grid = [];
var currentBlock;
var normalSpeed = true;
var gameIsStarted = false;
var interval = setInterval(fallDown, intervalMs);
var intervalMs = 400;
var score = 0;
var highscore = 0;
var gameOverBoolean = false;

document.onkeydown = checkKey;

var startNewGame = function(){
	intervalMs = 400;
	gameOverBoolean = false;
	score = 0;
	document.getElementById("score").innerHTML = "Score: " + score;
	normalSpeed = true;
    grid = [];
	for(var i = 0; i < 16; i++){
		var row = [];
		for(var j = 0; j < 8; j++){
			row.push(0);
		}
		grid.push(row);
	}
	currentBlock = getRandomBlock();
	for(var i = 0; i < 4; i++) {
		grid[currentBlock.form[i][0] + currentBlock.y][currentBlock.form[i][1] + currentBlock.x] = currentBlock.color;
	}
	gameIsStarted = true;
	showBoard();
}

function checkKey(e) {
  e = e || window.event;
  if(e.keyCode == '38' ) {//&& checkIfLegalMove("up")){
    currentBlock = rotateBlock(currentBlock, 1);
    showBoard();
  }
  if (e.keyCode == '40') {
  		clearInterval(interval);
  		normalSpeed = !normalSpeed;
  		if (normalSpeed) {
  			interval = setInterval(fallDown, intervalMs);
  		}
  		else {
  			interval = setInterval(fallDown, 100);
  		}
  }
  if (e.keyCode == '37' && checkIfLegalMove("left")) {
    moveHorizontal(-1);
    showBoard();
  }
  else if (e.keyCode == '39' && checkIfLegalMove("right")) {
    moveHorizontal(1);
    showBoard();
  }
}

var showBoard = function() {
  var board = document.getElementById("board");
  var rows = board.getElementsByClassName("row");
  var tiles;
  for (var i = 0; i < rows.length; i++) {
    tiles = rows[i].getElementsByClassName("tile");
    for (var j = 0; j < tiles.length; j++) {
      tiles[j].style.background = grid[i][j] !== 0 ? grid[i][j]  : "white";
    	}
	}
}

var moveHorizontal = function(direction) {
	// direction: left = -1, right = +1
	currentBlock.x += direction;
	for (var i = 0; i < 4; i++) {
		grid[currentBlock.form[i][0] + currentBlock.y][currentBlock.form[i][1] + currentBlock.x - direction] = 0;
	}
	for (var i = 0; i < 4; i++) {
		grid[currentBlock.form[i][0] + currentBlock.y][currentBlock.form[i][1] + currentBlock.x] = currentBlock.color;
	}
}

var checkIfLegalMove = function(dir) {
	if(dir === "left"){
		for(var i = 0; i < 4; i++){
			if(currentBlock.form[i][1] + currentBlock.x === 0){
				return false;
			}
      if(grid[currentBlock.y + currentBlock.form[i][0]][currentBlock.x + currentBlock.form[i][1] - 1] !== 0 && !checkIfCoorIsInCurrentBlock(currentBlock.y + currentBlock.form[i][0], currentBlock.x + currentBlock.form[i][1] - 1)){
        return false;
      }
		}
	}
	if(dir === "right"){
		for(var i = 0; i < 4; i++){
			if(currentBlock.form[i][1]  + currentBlock.x === 7){
				return false;
			}
      if(grid[currentBlock.y + currentBlock.form[i][0]][currentBlock.x + currentBlock.form[i][1] + 1] !== 0 && !checkIfCoorIsInCurrentBlock(currentBlock.y + currentBlock.form[i][0], currentBlock.x + currentBlock.form[i][1] + 1)){
        return false;
      }
		}
	}
	return true;
}

var getRandomBlock = function() {
	var type = Math.floor(Math.random() * 8);
	block = new Block(Blocks[Blocks[type]]);
	if(block.code === "I"){
		block.y = 2
	}
	else{
		block.y = 1;
	}
	block.x = 3;
	for(var i = 0; i < 4; i++){
		if(grid[block.y + block.form[i][0]][block.x + block.form[i][1]] !== 0){
			gameOver();
			return;
		}
	}
	clearInterval(interval);
	interval = setInterval(fallDown, intervalMs--);
	return block;
}

var checkIfCoorIsInCurrentBlock = function(a,b) {
  for(var i = 0; i < 4; i++){
    if(currentBlock.form[i][0] + currentBlock.y === a && currentBlock.form[i][1] + currentBlock.x === b){
      return true;
    }
  }
  return false;
}

var rotateBlock = function(block, orientation) {
	//rotates around second value in form
	if(!block.rotatable){
     return block;
   }
	for (var i = 0; i < block.form.length; i++) {
    	grid[block.y + block.form[i][0]][block.x + block.form[i][1]] = 0;
      block.form[i] = multiply([block.form[i]], orientation ? [[0, 1], [-1, 0]] : [[0, -1], [1, 0]])[0];
	}
	grid[block.form[0][0] + block.y][block.x + block.form[0][1]] = block.color;
	grid[block.y + block.form[1][0]][block.x + block.form[1][1]] = block.color;
	grid[block.y + block.form[2][0]][block.x + block.form[2][1]] = block.color;
	grid[block.y + block.form[3][0]][block.x + block.form[3][1]] = block.color;
	return block;
}

var checkIfMoveable = function(){
	for(var i = 0; i < 4; i++){
		if(currentBlock.y + currentBlock.form[i][0] === 15){
      checkIfLinesNeedToBeDeleted();
			currentBlock = getRandomBlock();
			return false;
		}
	}
  for(var i = 0; i < 4; i++){
    if(grid[currentBlock.y + currentBlock.form[i][0] + 1][currentBlock.x + currentBlock.form[i][1]] !== 0 && !checkIfCoorIsInCurrentBlock(currentBlock.y + currentBlock.form[i][0] + 1, currentBlock.x + currentBlock.form[i][1])){
      checkIfLinesNeedToBeDeleted();
      currentBlock = getRandomBlock();
      return false;
    }
  }
	return true;
}

function fallDown() {
	if(gameIsStarted && checkIfMoveable() && !gameOverBoolean) {
		for (var i = 0; i < 4; i++) {
			grid[currentBlock.y + currentBlock.form[i][0]][currentBlock.x + currentBlock.form[i][1]] = 0;
		}
		currentBlock.y ++;
		for (var i = 0; i < 4; i++) {
			grid[currentBlock.y + currentBlock.form[i][0]][currentBlock.x + currentBlock.form[i][1]] = currentBlock.color;
		}
		showBoard();
	}
}

var gameOver = function(){
  window.alert("game Over");
	if(score > highscore){
		highscore = score;
		document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
	}
	gameOverBoolean = true;
}
var checkIfLineIsFull = function(i){
  for(var j = 0; j < 8; j++){
    if(grid[i][j] === 0){
      return false;
    }
  }
  return true;
}
var checkIfLineIsEmpty = function(i){
  for(var j = 0; j < 8; j++){
    if(grid[i][j] !== 0){
      return false;
    }
  }
  return true;
}
var checkIfLinesNeedToBeDeleted = function(){
  for(var i = 0; i < 16; i++){
    if(checkIfLineIsFull(i)){
      for(var j = 0; j < 8; j++){
        grid[i][j] = 0;
      }
			score ++;
			document.getElementById("score").innerHTML = "Score: " + score;
    }
  }
  applyGravity();
}
var applyGravity = function(){
  for(var i = 15; i > 0; i--){
    var amountOfEmptyLines = 0;
    while(i - amountOfEmptyLines > 0 && checkIfLineIsEmpty(i - amountOfEmptyLines)){
      amountOfEmptyLines++;
    }
    for(var k = i; k > amountOfEmptyLines; k--){
      for(var j = 0; j < 8; j++){
        grid[k][j] = grid[k - amountOfEmptyLines][j];
      }
    }
  }
}

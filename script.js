//Size of game area
const gridSize = 50;
//time taken for each refresh in ms
const clock = 100;

//Set up game board
let setUpGameBoard = function () {
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement("div");
        row.classList.add("game-row");
        for (let i = 0; i < gridSize; i++) {
            var sq = document.createElement("div");
            sq.classList.add("game-square");
            row.appendChild(sq);
        }
        let gb = document.getElementById("game-board");
        gb.appendChild(row);
    }
}
setUpGameBoard();

//Snake starting variables
let start_i = Math.floor(gridSize / 2)
let start_j = Math.floor(gridSize / 4)

let snake = {
    position: [start_i, start_j],
    direction: "e",
    //Function that updates the position of the snake based on its current direction
    move: function () {
        switch (this.direction) {
            case "e":
                this.position[1]++;
                break;
            case "n":
                this.position[0]--;
                break;
            case "w":
                this.position[1]--;
                break;
            case "s":
                this.position[0]++;
                break;
        }
    },
    setDirection: function(d){
        this.direction = d;
    }
};

let apple = {
    position: {
        i:null,
        j:null
    },
    resetPosition: function(){
        this.position.i = Math.floor(Math.random()*gridSize);
        this.position.j = Math.floor(Math.random()*gridSize);
    }
}
apple.resetPosition();

//Set apple display
let setAppleDisplay = function() {
    let n = getSquareNode(apple.position.i,apple.position.j);
    n.style.backgroundColor = "red";
}

//Clear apple display
let clearAppleDisplay = function() {
    let n = getSquareNode(apple.position.i,apple.position.j);
    n.style.backgroundColor = "transparent";
}

//Returns true if snake is at apple
let isAtApple = function(){
    if(snake.position[0]===apple.position.i
        && snake.position[1]===apple.position.j){
            return true;
        } else {
            return false;
        }
}

//Check if snake is out of bounds
let isSnakeOOB = function () {
    if (snake.position[0] > gridSize - 1 //east border
        ||
        snake.position[0] < 0 //west border
        ||
        snake.position[1] > gridSize - 1 //south border
        ||
        snake.position[1] < 0 //north border
    ) {
        return true;
    } else {
        return false;
    }

}

//Get square from coordinates
let getSquareNode = function (i, j) {
    return document.getElementById("game-board").children[i].children[j]
}

//Set snake
let n = getSquareNode(snake.position[0], snake.position[1]);
n.style.backgroundColor = "black";

//Function that refreshes and updates snake position every clock
let moveSnake = function () {
    
    let interval = setInterval(moveSnake, clock);
    
    function moveSnake() {
    
        //Update snake position
        // console.log("snake coord:"+snake.position)
        let currSquare = getSquareNode(snake.position[0], snake.position[1])
    
        //Display apple
        setAppleDisplay();

        //Move snake
        snake.move();
    
        //If snake OOB, stop interval
        if (isSnakeOOB()) { 
            console.log("snake OOB");
            clearInterval(interval);
        } else {
            
            //if hit apple
            if(isAtApple()){
                clearAppleDisplay();
                apple.resetPosition();
            }
            
            //update display
            currSquare.style.backgroundColor = "transparent"
            getSquareNode(snake.position[0], snake.position[1]).style.backgroundColor = "black";
        }
    }
}


//-------- PRE START GAME 

//Get middle square
let startDisp = getSquareNode(start_i - 3, start_j * 2);

//Set start display
let setStartDisplay = function () {
    let dispP = document.createElement("p");
    //Set styles
    startDisp.style.lineHeight = "0";
    startDisp.style.position = "relative";
    startDisp.appendChild(dispP);
    dispP.innerHTML = "Hit space bar to start.";
    dispP.style.position = "absolute";
    dispP.style.left = "50%";
    dispP.style.marginLeft = -(dispP.offsetWidth / 2) + "px";
}

//Clear start display
let clearStartDisplay = function () {
    startDisp.innerHTML = "";
}

setStartDisplay();

//On space bar hit, clear start display, and begin moving snake.
let startGame = function () {
    document.addEventListener("keyup", spaceBarHit)

    function spaceBarHit() {
        //space bar is 32
        if (event.keyCode === 32) {
            clearStartDisplay();
            moveSnake();
        }
    }
}
startGame();

//Assign keyboard controls
let setControls = function () {
    document.addEventListener("keyup", arrowHit)

    function arrowHit() {
        console.log("arrow hit")
        switch (event.keyCode) {
            case 39: //east
                snake.setDirection("e");
                break;
            case 38: //north
                snake.setDirection("n");
                break;
            case 37: //west
                snake.setDirection("w");
                break;
            case 40: //south
                snake.setDirection("s");
                break;
        }
    }
}

setControls();
//Size of game area
const gridSize = 50;
//time taken for each refresh in ms
const clock = 100;
//Starting snake length
const startLength = 4;
//Snake head starting position
const start_i = Math.floor(gridSize / 2);
const start_j = startLength+1;
//Rounds
let gameRound = 0;
//Snake colour
let snakeColor = "#29383b";

//---CONVENIENCE FUNCTIONS
//Get square from coordinates
function getSquareNode(i, j) {
    return document.getElementById("game-board").children[i].children[j]
}

//Makes a copy of the original position array
function copyPosArray(original) {
    let crispy = [];
    for (x = 0; x < original.length; x++) {
        crispy[x] = {
            i: original[x].i,
            j: original[x].j
        }
    }
    return crispy;
}

//Get last segment object of given position array
function getLastSeg(posArray) {
    let seg = {
        i: null,
        j: null
    }
    seg.i = posArray[posArray.length - 1].i;
    seg.j = posArray[posArray.length - 1].j;

    return seg;
}

//--DISPLAY DOM MANIPULATION
//Set up game board
function setUpGameBoard() {
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


//---GAME OBJECTS

let snake = {
    //array of coordinates objects
    position: [],
    direction: "e",
    //Function that updates each position of the snake based on its current direction
    //Starting from the tail
    move: function () {

        //Starting from the tail
        //Update position of each segment to the one in front of it
        for (let x = this.position.length - 1; x > 0; x--) {
            this.position[x].i = this.position[x - 1].i
            this.position[x].j = this.position[x - 1].j
        }

        //Update head of snake based on direction
        switch (this.direction) {
            case "e":
                this.position[0].j++;
                break;
            case "n":
                this.position[0].i--;
                break;
            case "w":
                this.position[0].j--;
                break;
            case "s":
                this.position[0].i++;
                break;
        }

    },
    //Set direction of the snake
    setDirection: function (d) {
        this.direction = d;
    },

    //Push a new segment into the tail of the snake
    //Seg is a coordinate object
    pushSeg: function (seg) {
        //Add one more unit to tail
        this.position.push(seg);
    },
    
    //Reset snake to its original direction, position and size
    resetSnake: function() {
        this.direction = "e";
        this.position = [];
        let s_i = start_i;
        let s_j = start_j;    
        
        //Push 3 units into position array
        for (let x = 0; x < startLength; x++) {
            snake.position.push({
                i: s_i,
                j: s_j
            })
            s_j--;
        };
    }
};

//Snake convenience function: Checks if given coordinate is in the snake
function isInSnake(i, j) {
    let isInSnake = false;
    for (let x = 1; x < snake.position.length; x++) {
        if (i === snake.position[x].i &&
            j === snake.position[x].j) {
            isInSnake = true;
        }
    }
    return isInSnake;
}

//Checks if the snake is OOB
function isSnakeOOB(){
    if (snake.position[0].i > gridSize - 1 //east border
        ||
        snake.position[0].i < 0 //west border
        ||
        snake.position[0].j > gridSize - 1 //south border
        ||
        snake.position[0].j < 0 //north border
    ) {
        return true;
    } else {
        return false;
    }
}

//Check if snake runs into itself
function isSnakeHitSelf() {
    let i = snake.position[0].i;
    let j = snake.position[0].j;
    return isInSnake(i, j);
}


let apple = {
    position: {
        i: Math.floor(Math.random() * gridSize),
        j: Math.floor(Math.random() * gridSize)
    },
    //Resets position of apple 
    resetPosition: function () {

        let i = null;
        let j = null;
        
        //New apple location needs to be outside of snake
        do {
            i = Math.floor(Math.random() * gridSize);
            j = Math.floor(Math.random() * gridSize);
        } while (isInSnake(i, j))
        this.position.i = i;
        this.position.j = j;
    }
}

//------GAME DOM MANIPULATION

//Set apple display
function setAppleDisplay() {
    let n = getSquareNode(apple.position.i, apple.position.j);
    // n.style.backgroundImage = "url('./icons/apple.svg')"
    n.style.backgroundColor = "#e56345"
}

//Clear apple display
function clearAppleDisplay() {
    let n = getSquareNode(apple.position.i, apple.position.j);
    // n.style.backgroundImage = "none";
    n.style.backgroundColor = "none"
}

//Returns true if snake head is at apple
function isAtApple() {
    if (snake.position[0].i === apple.position.i &&
        snake.position[0].j === apple.position.j) {
        return true;
    } else {
        return false;
    }
}

//Displays snake on gameboard based on its coordinates
function setSnakeDisplay() {
    snake.position.forEach(seg => {
        let n = getSquareNode(seg.i, seg.j);
        n.style.backgroundColor = snakeColor;
    });
}

//clears snake display of given position array
function clearSnakeDisplay(posArray) {
    posArray.forEach(seg => {
        let n = getSquareNode(seg.i, seg.j);
        if(n!=undefined){
            n.style.backgroundColor = "transparent";
        }
    });
}

//Clears the gameboard of all objects (snake & apple)
function resetGameBoard(){
    let gs = document.querySelectorAll(".game-square")
    gs.forEach( n => {
        n.style.backgroundColor="transparent"
    });
    // setUpGameBoard();

}


//----------------MAIN GAME FLOW
//Refresh and update snake position every clock
let moveSnake = function () {

    let interval = setInterval(moveSnake, clock);

    function moveSnake() {

        //Make a copy of the snake position array
        let currPosArray = copyPosArray(snake.position);

        //Display apple
        setAppleDisplay();

        //Move snake
        snake.move();

        //If snake OOB, stop interval
        if (isSnakeOOB() || isSnakeHitSelf()) {
            console.log("snake ded");
            clearInterval(interval);
            apple.resetPosition();
            setStartDisplay();
            startGame();
        } else {

            //Clear snake from screen
            clearSnakeDisplay(currPosArray);

            //if hit apple, reset apple and increase length of snake
            if (isAtApple()) {
                clearAppleDisplay();
                apple.resetPosition();
                setAppleDisplay();
                snake.pushSeg(getLastSeg(currPosArray));
            }

            //update display
            setSnakeDisplay();
        }
    }
}

//---------------- PRE START GAME 

//Get middle square
let startDisp = getSquareNode(start_i - 2, start_j-3);
let dispP = document.createElement("p");
let titleN = document.createElement("h1");

//Set start display
function setStartDisplay() {
    startDisp = getSquareNode(start_i - 2, start_j-3);
    //Set style for display
    startDisp.style.lineHeight = "0";    
    // startDisp.style.position = "relative";

    //Create p element for text display

    dispP.classList.remove("fade-out")
    dispP.classList.add("fade-in")
    dispP.classList.add("start-display");
    startDisp.appendChild(dispP);
    
    let str = "";
    if(gameRound > 0){
        str = "Hit space bar to restart.";
    } else {
        str = "Hit space bar to start.";
    }
    dispP.innerHTML = str;
    dispP.style.position = "absolute";
    


    //Create title display
    let titleP = getSquareNode(1,start_j-3);
    titleP.style.lineHeight = "0";
    titleN.classList.remove("fade-out")
    titleN.classList.add("fade-in")
    titleP.appendChild(titleN);
    titleN.innerHTML = "Snake.";
    titleN.style.position = "absolute";
    titleN.classList.add("start-display");

    //Inialize baby snake
    if (gameRound===0){
        snake.resetSnake();
        setSnakeDisplay();
    }
}

//Clear start display
function clearStartDisplay() {
    // startDisp.innerHTML = "";
    // titleN.innerHTML = "";
    dispP.classList.remove("fade-in");
    dispP.classList.add("fade-out");
    titleN.classList.remove("fade-in");
    titleN.classList.add("fade-out");
}



//Add event listener for space bar hit
let startGame = function () {
    document.addEventListener("keyup", spaceBarHit)

    function spaceBarHit() {
        //space bar is 32
        if (event.keyCode === 32) {
            
            clearStartDisplay();
            if(gameRound>0){
                resetGameBoard();
                snake.resetSnake();
            }
            gameRound++;
            setControls();
            moveSnake();
            document.removeEventListener("keyup",spaceBarHit);
        }
    }
}

//Show start screen
setStartDisplay();
//Add event listener
startGame();

//Assign keyboard controls
function setControls() {
    document.addEventListener("keyup", arrowHit)

    function arrowHit() {
        console.log("arrow hit")
        switch (event.keyCode) {
            case 39: //east
                if(snake.direction != "w"){
                    snake.setDirection("e");
                }
                break;
            case 38: //north
                if(snake.direction != "s"){
                    snake.setDirection("n");
                }
                break;
            case 37: //west
            if(snake.direction != "e"){
                snake.setDirection("w");
            }
                break;
            case 40: //south
            if(snake.direction != "n"){
                snake.setDirection("s");
            }                
                break;
        }
    }
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
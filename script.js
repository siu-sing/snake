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
//Score
let score = 0;
//directions
const D = ['n','e','s','w'];

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
class Coordinate {
    constructor(i=0,j=0){
        this.i=i;
        this.j=j;
    }
}

class Snake {
    constructor(i = start_i, j = start_j){
        this.position=[]; //array of coordinates
        this.headColor = "#a2de96";
        this.direction="e";
        //Baby snake
        for (let x = 0; x < startLength; x++) {
            this.position.push(new Coordinate(i,j))
            j--;
        };
    }
    
    //Update new position of each segment 
    move(){
        //Starting from tail
        for (let x = this.position.length-1; x > 0 ; x--) {
            this.position[x].i = this.position[x - 1].i
            this.position[x].j = this.position[x - 1].j
        }
        //Head position
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
    }

    setDirection(d){
        this.direction=d;
    }

    //Push a new segment into the snake
    pushSegment(coordinate){
        this.position.push(coordinate);
    }

    //Checks if given coordinate is in snake;
    isInSnake(i, j, includeHead=false){
        let isInSnake = false;
        let startIndex = includeHead ? 0 : 1; 
        for (let x = startIndex; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                isInSnake = true;
            }
        }
        return isInSnake;
    }
    setDisplay(){
        this.position.forEach((seg,idx) => {
            let n = getSquareNode(seg.i, seg.j);
            if(idx==0){
                n.style.backgroundColor = this.headColor;    
            } else {
                n.style.backgroundColor = snakeColor;
            }
                
        });
    }

}


//Checks if the snake is OOB
function isSnakeOOB(snakeObj){
    if (snakeObj.position[0].i > gridSize - 1 //east border
        ||
        snakeObj.position[0].i < 0 //west border
        ||
        snakeObj.position[0].j > gridSize - 1 //south border
        ||
        snakeObj.position[0].j < 0 //north border
    ) {
        return true;
    } else {
        return false;
    }
}

//Check if snake runs into itself
function isSnakeHitSelf(snakeObj) {
    let i = snakeObj.position[0].i;
    let j = snakeObj.position[0].j;
    return snakeObj.isInSnake(i, j);
}


class Fruit{
    constructor(){
        this.position = getEmptyCoordinate();
    }
    resetPosition(){
        this.position = getEmptyCoordinate();
    }
}

//Generate random empty coordinate
function getEmptyCoordinate(){
    let c = new Coordinate(Math.floor(Math.random() * gridSize),Math.floor(Math.random() * gridSize))
    //NEED TO CHECK GAME BOARD FOR EMPTY COORDINATES
    return c
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

//Clears the gameboard of all objects (snake & apple)
function clearGameBoardDisplay(){
    let gs = document.querySelectorAll(".game-square")
    gs.forEach( n => {
        n.style.backgroundColor="transparent"
    });
}


class AISnake extends Snake{
    constructor(i=start_i-5,j=start_j){
        super(i,j);
        this.headColor="#e79c2a"
    }
    autoMove(coordinate){
        //Set direction based on current scenario
        // this.direction=D[Math.floor(Math.random()*3)]
        console.log(coordinate);
        let di = coordinate.i ;
        let dj = coordinate.j ;
        let i = this.position[0].i;
        let j = this.position[0].j;
        console.log(i,j)
        //southwest quadrant
        if(di>=i && dj>=j){
            switch(this.direction){
                case "s":
                    this.direction = i==di ? "e" : "s"
                case "e":
                    this.direction = j==dj ? "s" : "e";    
                    break;
                case "n":
                case "w":
                    this.direction = Math.random() >= 0.5 ? "e" : "s";
                    break;
            }
            
        }

        this.move();
    }
}

//Intialize new player snake
let playerSnake = new Snake();
setControls(playerSnake);
let AI = new AISnake();
AI.direction = "n";

playerSnake.setDisplay();
AI.setDisplay();

//----------------MAIN GAME FLOW
let gamePlay = function (){
    
    let mainInterval = setInterval(step, clock);
    
    function step(){
        let currSnakePosition = copyPosArray(playerSnake.position);
        clearGameBoardDisplay();
        playerSnake.move();
        AI.autoMove(new Coordinate(40,40));
        playerSnake.setDisplay();
        AI.setDisplay();
    }
}





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
                score++;
                document.getElementById("score").innerHTML = `${score}`
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
            score = 0;
            document.getElementById("round-no").innerHTML=`Round ${gameRound}`
            document.getElementById("score").innerHTML = `${score}`
            setControls();
            moveSnake();
            document.removeEventListener("keyup",spaceBarHit);
        }
    }
}



//Show start screen
// setStartDisplay();
//Add event listener
// startGame();

//Assign keyboard controls
function setControls(snakeObj) {
    document.addEventListener("keyup", arrowHit)

    function arrowHit() {
        console.log("arrow hit")
        switch (event.keyCode) {
            case 39: //east
                if(snakeObj.direction != "w"){
                    snakeObj.setDirection("e");
                }
                break;
            case 38: //north
                if(snakeObj.direction != "s"){
                    snakeObj.setDirection("n");
                }
                break;
            case 37: //west
            if(snakeObj.direction != "e"){
                snakeObj.setDirection("w");
            }
                break;
            case 40: //south
            if(snakeObj.direction != "n"){
                snakeObj.setDirection("s");
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
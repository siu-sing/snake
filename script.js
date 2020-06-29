//Size of game area
const gridSize = 30;
//time taken for each refresh in ms
const clock = 100;
//Starting snake length
const startLength = 10;
//Snake head starting position
const start_i = Math.floor(gridSize / 2);
const start_j = startLength + 1;

//Respawn delay in ms
const respawnDelay = 3000;

//Rounds
let gameRound = 0;
//Snake colour
let snakeColor = "#29383b";
//Score
let score = 0;
//directions
const D = ['n', 'e', 's', 'w'];

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
            j: original[x].j,
            dir: original[x].dir
        }
    }
    return crispy;
}

//Get last segment object of given position array
function getLastSeg(posArray) {
    let seg = {
        i: null,
        j: null,
        dir: null
    }
    seg.i = posArray[posArray.length - 1].i;
    seg.j = posArray[posArray.length - 1].j;
    seg.dir = posArray[posArray.length - 1].dir;

    return seg;
}

//Translates a given coordinate base on given direction and distance
function translate(a, b, dir, distance = 1) {
    let coordinate = {
        i: null,
        j: null
    };
    switch (dir) {
        case "e":
            coordinate.i = a;
            coordinate.j = b + (1 * distance);
            break;
        case "n":
            coordinate.i = a - (1 * distance);
            coordinate.j = b;
            break;
        case "w":
            coordinate.i = a;
            coordinate.j = b - (1 * distance);
            break;
        case "s":
            coordinate.i = a + (1 * distance);
            coordinate.j = b;
            break;
    }
    return coordinate;
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
    constructor(i = 0, j = 0, dir = "e") {
        this.i = i;
        this.j = j;
        this.dir = dir;
    }
}

class Snake {
    constructor(i = start_i, j = start_j) {
        this.position = []; //array of coordinates
        this.headColor = "#a2de96";
        this.direction = "e";
        this.isDead = false;
        //Baby snake
        for (let x = 0; x < startLength; x++) {
            this.position.push(new Coordinate(i, j))
            j--;
        };
    }

    //Update new position of each segment 
    move() {
        if (this.isDead) {
            return;
        } else {
            //Starting from tail
            for (let x = this.position.length - 1; x > 0; x--) {
                this.position[x].i = this.position[x - 1].i
                this.position[x].j = this.position[x - 1].j
                this.position[x].dir = this.position[x - 1].dir
            }
            //Head position
            this.position[0].dir = this.direction;
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

    }

    setDirection(d) {
        this.direction = d;
    }

    //Push a new segment into the snake
    pushSegment(coordinate) {
        if (this.isDead) {
            return;
        } else {
            this.position.push(coordinate);
        }
    }

    //Checks if given coordinate is in snake;
    isInSnake(i, j, includeHead = false) {
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
    dirAtPosition(i, j) {
        let dir = null;
        for (let x = 0; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                dir = this.position[x].dir;
            }
        }
        return dir
    }
    setDisplay() {
        if (this.isDead) {
            return;
        } else {
            this.position.forEach((seg, idx) => {
                let n = getSquareNode(seg.i, seg.j);
                if (idx == 0) {
                    n.style.backgroundColor = this.headColor;
                } else {
                    n.style.backgroundColor = snakeColor;
                }

            });
        }
    }
    isAtApple(fruitObj) {
        if (fruitObj.position.i == this.position[0].i &&
            fruitObj.position.j == this.position[0].j) {
            return true;
        } else {
            return false;
        }
    }
    //Returns position index of given segment coordinate
    positionIndex(i, j) {
        let index = null;
        for (let x = 0; x < this.position.length; x++) {
            if (i === this.position[x].i &&
                j === this.position[x].j) {
                index = x;
            }
        }
        return index;

    }
    kill() {
        this.position = [];
        this.isDead = true;
    }

}

//Checks if the snake is OOB
function isSnakeOOB(snakeObj) {
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

let testFruitCoord = [];
// testFruitCoord.push(new Coordinate(25,25));
// testFruitCoord.push(new Coordinate(18, 25));
// testFruitCoord.push(new Coordinate(40, 22));

class Fruit {
    constructor() {
        this.position = getEmptyCoordinate();
        this.color = "#e56345"
    }
    resetPosition() {
        if (testFruitCoord.length > 0) {
            this.position = testFruitCoord.shift();
        } else {
            this.position = getEmptyCoordinate();
        }

    }
    setDisplay() {
        let n = getSquareNode(this.position.i, this.position.j);
        // n.style.backgroundImage = "url('./icons/apple.svg')"
        n.style.backgroundColor = this.color;
    }
}

//Generate random empty coordinate
function getEmptyCoordinate() {
    if (snakeList.length > 0) {
        let success = true;
        let c = null;
        do {
            c = new Coordinate(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize))
            snakeList.forEach(s => function () {
                success = !s.isInSnake(c.i, c.j, true)
            });
            return c
        } while (success = false);
    } else {
        return new Coordinate(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
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

//Clears the gameboard of all objects (snake & apple)
function clearGameBoardDisplay() {
    let gs = document.querySelectorAll(".game-square")
    gs.forEach(n => {
        n.style.backgroundColor = "transparent"
    });
}



class AISnake extends Snake {
    constructor(i = start_i - 5, j = start_j - 5) {
        super(i, j);
        this.headColor = "#e79c2a"
        this.position = [];
        for (let x = 0; x < startLength - 5; x++) {
            this.position.push(new Coordinate(i, j))
            j--;
        };

    }
    //Checks if movement 1 unit in "dir" will result in snake
    isNewPosInSnake(dir) {
        let newPos = translate(this.position[0].i, this.position[0].j, dir);
        return this.isInSnake(newPos.i, newPos.j)
    }

    autoMove(fruit) {


        if (this.isDead) {
            return;
        } else {
            //Set direction based on current scenario
            // this.direction=D[Math.floor(Math.random()*3)]
            // console.log(coordinate);
            let di = fruit.position.i;
            let dj = fruit.position.j;
            let i = this.position[0].i;
            let j = this.position[0].j;

            //southeast quadrant
            if (di >= i && dj >= j) {
                switch (this.direction) {
                    case "s":
                        this.direction = i == di ? "e" : "s"
                    case "e":
                        this.direction = j == dj ? "s" : "e";
                        break;
                    case "n":
                        this.direction = "e";
                        break;
                    case "w":
                        this.direction = "s";
                        break;
                }
                //southwest quadrant
            } else if (di >= i && dj <= j) {
                switch (this.direction) {
                    case "s":
                        this.direction = i == di ? "w" : "s"
                        break;
                    case "w":
                        this.direction = j == dj ? "s" : "w";
                        break;
                    case "e":
                        this.direction = "s";
                        break;
                    case "n":
                        this.direction = "w";
                        break;
                }
                //northwest quadrant
            } else if (di <= i && dj <= j) {
                switch (this.direction) {
                    case "n":
                        this.direction = i == di ? "w" : "n"
                        break;
                    case "w":
                        this.direction = j == dj ? "n" : "w";
                        break;
                    case "e":
                        this.direction = "n";
                        break;
                    case "s":
                        this.direction = "w";
                        break;
                }
                //northeast quadrant
            } else if (di <= i && dj >= j) {
                switch (this.direction) {
                    case "n":
                        this.direction = i == di ? "e" : "n"
                        break;
                    case "e":
                        this.direction = j == dj ? "n" : "e";
                        break;
                    case "s":
                        this.direction = "e";
                        break;
                    case "w":
                        this.direction = "n";
                        break;
                }
            }

            //CHECK IF NEW DIRECTION COLLIDES WITH ITSELF
            if (this.isNewPosInSnake(this.direction)) {
                console.log("will collide")
                let newPos = translate(this.position[0].i, this.position[0].j, this.direction);
                console.log(`current position: ${this.position[0].i},${this.position[0].j}`)
                console.log(`newPos: ${newPos.i}, ${newPos.j}`)
                let dir = this.dirAtPosition(newPos.i, newPos.j);
                console.log(`direction at position: ${dir}`)
                switch (this.direction) {
                    case "n":
                    case "s":
                        switch (dir) {
                            case "w":
                                this.direction = this.isNewPosInSnake("e") ? "w" : "e";
                                break;
                            case "e":
                                this.direction = this.isNewPosInSnake("w") ? "e" : "w";
                                break;
                            case "s":
                            case "n":
                                this.direction = this.position[this.positionIndex(newPos.i, newPos.j) + 1].dir == "w" ? "e" : "w";
                                break;
                        }
                        break;
                    case "e":
                    case "w":
                        switch (dir) {
                            case "s":
                                this.direction = this.isNewPosInSnake("n") ? "s" : "n";
                                break;
                            case "n":
                                this.direction = this.isNewPosInSnake("s") ? "n" : "s";
                                break;
                            case "e":
                            case "w":
                                this.direction = this.position[this.positionIndex(newPos.i, newPos.j) + 1].dir == "s" ? "n" : "s";
                                break;

                        }
                        break;
                }
                console.log(`result: ${this.direction}`)
            }
            //IF SO, CHOOSE A NEW DIRECTION THAT DOESN'T

            this.move();
        }
    }
}

let snakeList = [];

//Intialize new player snake
let playerSnake = new Snake();
snakeList.push(playerSnake);
setControls(playerSnake);

//Initialize fruit for player
let playerApple = new Fruit();
playerApple.color = "#5a3d55";

//Initialize all displays
playerSnake.setDisplay();


let battleInterval = null;
let classicInterval = null;

document.getElementById("pause").addEventListener('click', function () {
    clearInterval(battleInterval);
});

document.getElementById("play-classic").addEventListener('click', function () {
    gamePlayClassic();
});


let AI = null;
let AIapple = null;
document.getElementById("play-battle").addEventListener('click', function () {
    
    //Initialize new AI Snake
    AI = new AISnake();
    snakeList.push(AI);
    
    //Initialize dummy fruit for AI
    AIapple = new Fruit();

    AI.setDisplay();
    playerApple.setDisplay();
    AIapple.setDisplay();

    //Began Battle Snakes
    gamePlayBattle();
    

});

//----------------MAIN GAME FLOW
let gamePlayBattle = function () {

    battleInterval = setInterval(step, clock);

    function step() {
        let currSnakeLastSeg = null;
        let currAILastSeg = null;

        //Store position of last segment of each snake
        if (!playerSnake.isDead) {
            currSnakeLastSeg = getLastSeg(playerSnake.position);
        }
        if (!AI.isDead) {
            currAILastSeg = getLastSeg(AI.position);
        }

        //Move Snakes
        playerSnake.move();
        AI.autoMove(AIapple);

        //Player Snake Dies end main interval
        if (isSnakeOOB(playerSnake) ||
            isSnakeHitSelf(playerSnake) ||
            AI.isInSnake(playerSnake.position[0].i, playerSnake.position[0].j, true)
        ) {
            if (playerSnake.position[0].i == AI.position[0].i &&
                playerSnake.position[0].i == AI.position[0].i) {
                console.log("Head on collision")
            } else {
                console.log(`Player Ded`);
            }
            clearInterval(battleInterval);
        } else {
            //Check conditions

            //Player snake eats apple
            if (playerSnake.isAtApple(playerApple)) {
                playerApple.resetPosition();
                playerSnake.pushSegment(currSnakeLastSeg);
            }

            if (!AI.isDead) {
                if (isSnakeHitSelf(AI) ||
                    playerSnake.isInSnake(AI.position[0].i, AI.position[0].j, true)) {
                    console.log(`AI Ded`)
                    AI.kill();
                    setTimeout(function () {
                        AI = new AISnake();
                        AI.setDisplay();
                        AIapple.resetPosition();
                    }, respawnDelay);
                } else if (AI.isAtApple(AIapple)) {
                    AIapple.resetPosition();
                    AI.pushSegment(currAILastSeg);
                }
            }
            //Reset grid display
            clearGameBoardDisplay();
            //Show display
            playerSnake.setDisplay();
            playerApple.setDisplay();
            AI.setDisplay();
            AIapple.setDisplay();
        }
    }
}






//Refresh and update snake position every clock
let gamePlayClassic = function () {

    classicInterval = setInterval(step, clock);

    function step() {
        
        //Store position of last segment of snake
        let currSnakeLastSeg = null;
        if (!playerSnake.isDead) {
            currSnakeLastSeg = getLastSeg(playerSnake.position);
        }

        //Move snake
        playerSnake.move();

        //Player Snake Dies end interval
        if (isSnakeOOB(playerSnake) || isSnakeHitSelf(playerSnake)
        ) {
            console.log(`Player Ded`);
            clearInterval(classicInterval)
        } else {
            if (playerSnake.isAtApple(playerApple)) {
                playerApple.resetPosition();
                playerSnake.pushSegment(currSnakeLastSeg);
            }
            //Reset grid display
            clearGameBoardDisplay();
            //Show display
            playerSnake.setDisplay();
            playerApple.setDisplay();
        }
    }
}

//---------------- PRE START GAME 

//Get middle square
let startDisp = getSquareNode(start_i - 2, start_j - 3);
let dispP = document.createElement("p");
let titleN = document.createElement("h1");

//Set start display
function setStartDisplay() {
    startDisp = getSquareNode(start_i - 2, start_j - 3);
    //Set style for display
    startDisp.style.lineHeight = "0";
    // startDisp.style.position = "relative";

    //Create p element for text display

    dispP.classList.remove("fade-out")
    dispP.classList.add("fade-in")
    dispP.classList.add("start-display");
    startDisp.appendChild(dispP);

    let str = "";
    if (gameRound > 0) {
        str = "Hit space bar to restart.";
    } else {
        str = "Hit space bar to start.";
    }
    dispP.innerHTML = str;
    dispP.style.position = "absolute";



    //Create title display
    let titleP = getSquareNode(1, start_j - 3);
    titleP.style.lineHeight = "0";
    titleN.classList.remove("fade-out")
    titleN.classList.add("fade-in")
    titleP.appendChild(titleN);
    titleN.innerHTML = "Snake.";
    titleN.style.position = "absolute";
    titleN.classList.add("start-display");

    //Inialize baby snake
    if (gameRound === 0) {
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
            if (gameRound > 0) {
                resetGameBoard();
                snake.resetSnake();
            }
            gameRound++;
            score = 0;
            document.getElementById("round-no").innerHTML = `Round ${gameRound}`
            document.getElementById("score").innerHTML = `${score}`
            setControls();
            moveSnake();
            document.removeEventListener("keyup", spaceBarHit);
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
                if (snakeObj.direction != "w") {
                    snakeObj.setDirection("e");
                }
                break;
            case 38: //north
                if (snakeObj.direction != "s") {
                    snakeObj.setDirection("n");
                }
                break;
            case 37: //west
                if (snakeObj.direction != "e") {
                    snakeObj.setDirection("w");
                }
                break;
            case 40: //south
                if (snakeObj.direction != "n") {
                    snakeObj.setDirection("s");
                }
                break;
        }
    }
}

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


// function getBestDirection (AISnakeObj){
//     let suggestedDir = null;
//     //snake head position
//     let headPosition = AISnakeObj.position[0]; 
//     let currDir = AISnakeObj.direction;
//     let newPos = translate(headPosition.i, headPosition.j, currDir);
//     //If intended direction collides with self
//     if(AISnakeObj.isInSnake(newPos.i,newPos.j)==true){
//         let dir = AISnakeObj.dirAtPosition(newPos.i,newPos.j);
//         switch(currDir){
//             case "n":
//             case "s":

//                 suggestedDir = dir=="w" ? "e" : "w"
//                 break;
//             case "e":
//             case "w":
//                 this.direction = dir=="s" ? "n" : "s"
//                 break;
//         }
//     } else {
//         return currDir;
//     }
//     //if same dir block, 
//         //then check next best
//         // if next best blocked, then take last option
//     //base case, 2 out of three blocked, escape with the only possible path

//     }

//     //1 blocked, default
// }
//Size of game area
const gridSize = 30;
//time taken for each refresh in ms
const clock = 100;
//Starting snake length
const startLength = 4;

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


let snake = {
    //array if coordinates objects
    position: [],
    direction: "e",
    //Function that updates each position of the snake based on its current direction
    //Starting from the tail
    move: function () {

        //For each segment of the snake, update to next segment
        for (let x = this.position.length - 1; x > 0; x--) {
            this.position[x].i = this.position[x - 1].i
            this.position[x].j = this.position[x - 1].j
        }

        //For the head of the snake
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
    setDirection: function (d) {
        this.direction = d;
    },
    pushSeg: function (seg) {
        //Add one more unit to tail
        this.position.push(seg);
    }
};

//Initialize baby snake
let start_i = Math.floor(gridSize / 2)
let start_j = Math.floor(gridSize / 4)

//Push 3 units into position array
for (let x = 0; x < startLength; x++) {
    snake.position.push({
        i: start_i,
        j: start_j
    })
    start_j--;
};

//Function returns true if given snake is within given coordinates
let isInSnake = function (i, j) {
    let isInSnake = false;
    for (let x = 1; x < snake.position.length; x++) {
        if (i === snake.position[x].i &&
            j === snake.position[x].j) {
            isInSnake = true;
        }
    }
    return isInSnake;
}


let apple = {
    position: {
        i: null,
        j: null
    },
    resetPosition: function () {

        let i = null;
        let j = null;
        do {
            i = Math.floor(Math.random() * gridSize);
            j = Math.floor(Math.random() * gridSize);
        } while (isInSnake(i, j))
        
        this.position.i = i;
        this.position.j = j;
        
    }
}
apple.resetPosition();

//Set apple display
let setAppleDisplay = function () {
    let n = getSquareNode(apple.position.i, apple.position.j);
    n.style.backgroundColor = "red";
}

//Clear apple display
let clearAppleDisplay = function () {
    let n = getSquareNode(apple.position.i, apple.position.j);
    n.style.backgroundColor = "transparent";
}

//Returns true if snake is at apple
let isAtApple = function () {
    if (snake.position[0].i === apple.position.i &&
        snake.position[0].j === apple.position.j) {
        return true;
    } else {
        return false;
    }
}

//Check if snake is out of bounds
let isSnakeOOB = function () {
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
let isSnakeHitSelf = function () {
    let i = snake.position[0].i;
    let j = snake.position[0].j;
    return isInSnake(i, j);
}


//Get square from coordinates
let getSquareNode = function (i, j) {
    return document.getElementById("game-board").children[i].children[j]
}

//Set snake
let setSnakeDisplay = function () {
    snake.position.forEach(seg => {
        let n = getSquareNode(seg.i, seg.j);
        n.style.backgroundColor = "black"
    });
}
setSnakeDisplay();

//Copies original array and returns the new copy
let copyPosArray = function (original) {
    let crispy = [];
    for (x = 0; x < original.length; x++) {
        crispy[x] = {
            i: original[x].i,
            j: original[x].j
        }
    }
    return crispy;
}

//clears snake display of given position array
let clearSnakeDisplay = function (posArray) {
    posArray.forEach(seg => {
        let n = getSquareNode(seg.i, seg.j);
        n.style.backgroundColor = "transparent"
    });
}

//Get last segment object of given position array
let getLastSeg = function (posArray) {
    let seg = {
        i: null,
        j: null
    }

    seg.i = posArray[posArray.length - 1].i;
    seg.j = posArray[posArray.length - 1].j;

    return seg;
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
        } else {

            //Clear snake from screen
            clearSnakeDisplay(currPosArray);

            //if hit apple, reset apple and increase length of snake
            if (isAtApple()) {
                clearAppleDisplay();
                apple.resetPosition();

                snake.pushSeg(getLastSeg(currPosArray));
            }

            //update display
            setSnakeDisplay();
        }
    }
}

//---------------- PRE START GAME 

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

//On space bar hit, clear start display, and begin moving snake
let startGame = function () {
    document.addEventListener("keyup", spaceBarHit)

    function spaceBarHit() {
        //space bar is 32
        if (event.keyCode === 32) {
            clearStartDisplay();
            setControls();
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
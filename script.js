
//Size of game area
const gridSize = 50;
//time taken for each refresh in ms
const clock = 100;

//Set up game board
let setUpGameBoard = function(){
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
let start_i = Math.floor(gridSize/2)
let start_j = Math.floor(gridSize/4)

let snake = {
    position:[start_i,start_j],
    direction:"e",
    move: function(){
        switch(this.direction){
            case "e":
                this.position[1]++;
                break;
        }
    }
};

//Get square from coordinates
let getSquareNode = function(i,j){
    return document.getElementById("game-board").children[i].children[j]
}

//Set snake
let n = getSquareNode(snake.position[0],snake.position[1]);
n.style.backgroundColor = "red";

//Function that refreshes and updates snake position every clock
let moveSnake = function(){
    let interval = setInterval(moveSnake, clock);
    function moveSnake() {       
        //If snake position exceeds right border
        if(snake.position[1]>gridSize-1){
            return;
        } else {
            console.log(snake.position[1])
            getSquareNode(snake.position[0],snake.position[1]).style.backgroundColor = "transparent";
            snake.move();
            getSquareNode(snake.position[0],snake.position[1]).style.backgroundColor = "red";
        }
    }
}

moveSnake();
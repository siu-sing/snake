# sei-23-project-1
Project 1 for SEI-23

[Snake]<https://siu-sing.github.io/snake/>

### Objectives
- Create basic Game UI with HTML, JS and CSS
- Practice DOM manipulation from js and user input
- Develop algorithm in js replicate the snake mechanics

### MVP 
This was the original MVP plan at the start of the project:
- Game board maybe 100 x 100 units
- A “snake” (1 unit) to start on the middle of the board
- The snake is maneuverable by the player with arrow keys
- The snake can “eat the objects” (i.e. object disappears)

### Furthers
- Snake increases in length for each object eaten
- Snake is more than 1 px and follows the trail as it moves
- Snake dies on contact with walls or itself
- Scoreboard, round indicator, game restarts, basic styling

### Game structure - objects, DOMs 
#### Game Board
#### Snake
#### Apple

### Overall Game flow 
<!-- ![Screen Capture](./screencapture.gif) -->
<img src="./screencapture.gif" width="250px">
- "Animation" of snake kicks off based on default direction of snake
- Snake direction is updated based on the key press by the user
- In the next frame, snake moves in the new direction set by the user
- Each snake movement will check 3 things:

|Condition						|Yes				|No		|
|:-------------------------------|:-------------------|:-------|
|Is snake out of bounds?		| Dies. Game over.	| Continue movement|
|Did snake collide with itself?	| Dies. Game over.	| Continue movement|
|Did snake eat the apple?		| Increment snake by one segment, inserted at tail | Continue movement|

### Styling 
### Sprint Process

// Gameboard object
//  IIFE
//  Contains array that contains all empty spaces that will eventually be 
//      filled with player moves
//  Said array doesn't need to be exposed, as a function that receives an 
//      array index could be used to alter the array, allowing it to remain private.

function gameBoard() {
    const board = [];

    //Create the 3x3 grid:
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let newRow = [0, 0, 0];
            board.push(newRow);
        }
    }

    //Return board for rendering purposes
    const getBoard = () => board;

    const playTurn = (i, j, playerToken) => {
        board[i][j] = playerToken;
    }

    //Print board to console
    const consoleBoard = () => {
        for (let i = 0; i < 3; i++) {
            console.log(board[i])
            console.log("\n");
        }
    }

    return { getBoard, playTurn, consoleBoard };
};

// Player X/O object
// Both player objects need to be able to receive input and alter the gameboard.
//     Input will be processed by UI later.
// Instructions note that players are stored in objects, but also I see that in the
//      connect 4 example, they are an object that exists within the game logic obj.
// Need to hold player name and token label? X vs O? And score?
// Could be a factory function that

// Game logic object
// IIFE
// This object tracks win conditions by monitoring the board? (Doesn't that then mean
//      that the array must be public? Or is there a function to check for a win?)

function gameLogic(
    playerXDefaultName = "Player X",
    playerYDefaultName = "Player Y"
) {

    console.log("Game started, get ready!");

    const board = gameBoard();

    const victoryDeclaration = document.querySelector("#victory-declaration")

    let turnsPlayed = 0;
    let gameOver = false;

    const player = [
        {
            name: playerXDefaultName,
            token: "X"
        },
        {
            name: playerYDefaultName,
            token: "Y"
        }
    ]

    let activePlayer = player[0];

    const getActivePlayer = () => {
        return activePlayer;
    }

    const switchTurn = () => {
        console.log("Switching turn!")
        console.log("Current active player is " + activePlayer.name + "...")
        activePlayer = (activePlayer === player[0]) ? player[1] : player[0];
        console.log("New current player is " + activePlayer.name + ", whose token is " + activePlayer.token)
        return activePlayer;
    }

    const declareWinner = () => {
        console.log("Game Over! Player " + getActivePlayer().token + " wins!");
        console.log("The final board:")
        board.consoleBoard();
        victoryDeclaration.textContent = getActivePlayer().name + " wins! Wowee what a match!!!"
        gameOver = true;
        return;
    }

    const playRound = (i, j) => {
        //Assign player's token to [i][j]:
        console.log("Trying to assign " + getActivePlayer().name + "'s token (" + getActivePlayer().token + ") to space [" + i + "][" + j + "]");

        //Check for filled space:
        if (board.getBoard()[i][j] !== 0) {
            console.log("Hey, that space is already filled! Try again, pal!");
            return true;
        }

        console.log("Unplayed spot detected, playing round!")
        board.playTurn(i, j, getActivePlayer().token);
        turnsPlayed++;

        //Check for game ending conditions:

        if ((board.getBoard()[0][0] == board.getBoard()[0][1]) && (board.getBoard()[0][0] == board.getBoard()[0][2])) { //Top row entirely the same:
            if (board.getBoard()[0][0] !== 0) {
                console.log("Victory by top row!")
                declareWinner();
                return;
            }
        } else if ((board.getBoard()[1][0] == board.getBoard()[1][1]) && (board.getBoard()[1][0] == board.getBoard()[1][2])) { //Middle row entirely the same:
            if (board.getBoard()[1][0] !== 0) {
                console.log("Victory by middle row!")
                declareWinner();
                return;
            }
        } else if ((board.getBoard()[2][0] == board.getBoard()[2][1]) && (board.getBoard()[2][1] == board.getBoard()[2][2])) { //Bottom row entirely the same:
            if (board.getBoard()[2][0] !== 0) {
                console.log("Victory by bottom row!")
                declareWinner();
                return;
            }
        } else if ((board.getBoard()[0][0] == board.getBoard()[1][0]) && (board.getBoard()[0][0] == board.getBoard()[2][0])) { //Left column entirely the same:
            console.log("Victory by left column!")
            declareWinner();
            return;
        } else if ((board.getBoard()[0][1] == board.getBoard()[1][1]) && (board.getBoard()[0][1] == board.getBoard()[2][1])) { //Middle column entirely the same:
            if (board.getBoard()[0][1] !== 0) {
                console.log("Victory by middle column!")
                declareWinner();
                return;
            }
        } else if ((board.getBoard()[0][2] == board.getBoard()[1][2]) && (board.getBoard()[0][2] == board.getBoard()[2][2])) { //Right column entirely the same:
            if (board.getBoard()[0][2] !== 0) {
                declareWinner();
                console.log("Victory by right column!")
                return;
            }
        } else if ((board.getBoard()[0][0] == board.getBoard()[1][1]) && (board.getBoard()[0][0] == board.getBoard()[2][2])) { //Left to right diagonal entirely the same:
            if (board.getBoard()[0][0] !== 0) {
                declareWinner();
                console.log("Victory by left to right diagonal!")
                return;
            }
        } else if ((board.getBoard()[0][2] == board.getBoard()[1][1]) && (board.getBoard()[0][2] == board.getBoard()[2][0])) { //Right to left diagonal entirely the same:
            console.log("Victory by right to left diagonal!")
            declareWinner();
            return;
        } else if (turnsPlayed == 9) {//if no other win conditions are true AND it's been 9 turns (with no winner):
            console.log("Game has gone too long, all spaces covered, nobody wins!!! TIE!!!!")
            victoryDeclaration.textContent = "A TIE!!!"
            gameOver = true;
            return;
        }
        switchTurn();
        board.consoleBoard();
        console.log("Player has been switched and board displayed above!")
    }

    function getGameState() {
        return gameOver;
    }

    function restartGame() {
        gameOver = false;
    }

    return { player, getActivePlayer, playRound, getGameState, restartGame, getBoard: board.getBoard }
};

const displayControl = (function () {
    console.log("Display control function started!")

    let sameSpot = false; //detects played rounds where the a previously played spot is clicked
    let game = gameLogic();
    console.log("Game successfully started!")

    const screenBoard = document.querySelector("#board");
    const turnDeclaration = document.querySelector("#turn-declaration");

    if (!screenBoard) {
        console.log("screenBoard not created!")
    }

    let currentBoard = game.getBoard();
    let activePlayer = game.getActivePlayer();
    console.log("Activeplayer assigned for the first time, with name [" + activePlayer.name + "] and token " + activePlayer.token)

    function updateScreen() {
        console.log("Updating screen!")
        turnDeclaration.textContent = "It is now " + activePlayer.name + "'s turn!";
    }

    function clickHandler(e) {
        if (game.getGameState() == true) {
            console.log("Game is over, no more actions allowed!")
            return;
        }

        const selectedCellX = e.target.dataset.xcoord;
        const selectedCellY = e.target.dataset.ycoord;
        if (!selectedCellX) {
            console.log("No coordinates found!")
            return;
        }

        console.log("You clicked on cell [" + selectedCellX + "][" + selectedCellY + "]")
        sameSpot = game.playRound(selectedCellX, selectedCellY);
        console.log("sameSpot = " + sameSpot)
        if (!sameSpot){
            e.target.textContent = activePlayer.token;
            activePlayer = game.getActivePlayer();
            console.log("Updating player object in displayControl scope, with name [" + activePlayer.name + "] and token " + activePlayer.token);
        } else if (sameSpot){
            console.log("Player attempted to play on the same spot, nothing changed!");
            sameSpot = false;
        }
        updateScreen();
    }

    function restartGame() {
        console.log("Resetting game!")
        sameSpot = false;
        game = gameLogic();
        currentBoard = game.getBoard();
        activePlayer = game.getActivePlayer();

        let allCells = document.querySelectorAll(".ttt-cell")
        allCells.forEach((textCell) => {
            textCell.textContent = "";
        });

        document.querySelector("#victory-declaration").textContent = "";

        updateScreen();
    }

    screenBoard.addEventListener("click", clickHandler);
    document.querySelector("#restart-button").addEventListener("click", restartGame)

    function updatePlayerNames(){
        let newXName = document.querySelector("#player-x-name").value;
        let newYName = document.querySelector("#player-y-name").value;

        if (newXName){
            console.log("Player X name change detected!")
            game.player[0].name = newXName;
            updateScreen();
            document.querySelector("#player-x-name").value = "";
        }
        if (newYName){
            console.log("Player Y name change detected!")
            game.player[1].name = newYName;
            updateScreen();
            document.querySelector("#player-y-name").value = "";
        }
    }

    document.querySelector("#name-change-button").addEventListener("click", updatePlayerNames)

    updateScreen();
})();

//gameLogic.playRound(0, 0)
//gameLogic.playRound(0, 0)
//gameLogic.playRound(0, 2)
//gameLogic.playRound(2, 2)
//gameLogic.playRound(2, 1)
//gameLogic.playRound(1, 0)
//gameLogic.playRound(0, 1)
//gameLogic.playRound(1, 1)
//gameLogic.playRound(2, 0)

// SCOPE TALK
//  The only things that need to be visible, as seen also in the connect 4 example,
//  are the Gameboard (because the DOM needs to eventually see and display it) and
//  the game logic.

//Example flow:
// cotroller gets called to start the game
// playerX plays [0][0], so that point in the 2d array is filled with an "X".
// gameboard is checked for win/tie
// If no winner, switch active player to playerO, who then also takes a turn.
//  Future turns, starting here, can't play turns on spaces that are already filled
//  Turns can't be played if the game has ended (won or tied)
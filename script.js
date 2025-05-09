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

const gameLogic = (function (
    playerXDefaultName = "Player X",
    playerYDefaultName = "Player Y"
) {

    console.log("Game started, get ready!");

    const board = gameBoard();

    let turnsPlayed = 0;

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
        return activePlayer = (activePlayer === player[0]) ? player[1] : player[0];
    }

    const declareWinner = () => {
        console.log("Game Over! Player " + getActivePlayer().token + " wins!");
        board.consoleBoard();
    }

    const playRound = (i, j) => {
        //Assign player's token to [i][j]:
        console.log("Trying to assign " + getActivePlayer().name + "'s token (" + getActivePlayer().token + ")");

        //Check for filled space:
        if (board.getBoard()[i][j] !== 0) {
            console.log("Hey, that space is already filled! Try again, pal!");
            return;
        }

        board.playTurn(i, j, getActivePlayer().token);
        turnsPlayed++;



        //Check for game ending conditions:

        if ((board.getBoard()[0][0] == board.getBoard()[0][1]) && (board.getBoard()[0][0] == board.getBoard()[0][2])) { //Top row entirely the same:
            declareWinner();
            return;
        } else if ((board.getBoard()[0][0] == board.getBoard()[1][0]) && (board.getBoard()[0][0] == board.getBoard()[2][0])) { //Left columnentirely the same:
            declareWinner();
            return;
        }  else if ((board.getBoard()[0][1] == board.getBoard()[0][0]) && (board.getBoard()[0][0] == board.getBoard()[2][0])) { //Middle column entirely the same:
            declareWinner();
            return;
        } else if ((board.getBoard()[0][0] == board.getBoard()[1][1]) && (board.getBoard()[0][0] == board.getBoard()[2][2])) { //Left to right diagonal entirely the same:
            declareWinner();
            return;
        } else if ((board.getBoard()[0][2] == board.getBoard()[1][1]) && (board.getBoard()[0][2] == board.getBoard()[2][0])) { //Right to left diagonal entirely the same:
            declareWinner();
            return;
        }
    }

    switchTurn();
    board.consoleBoard();
}

    return { getActivePlayer, playRound }
}) ();

gameLogic.playRound(0, 0)
gameLogic.playRound(0, 0)
gameLogic.playRound(1, 0)
gameLogic.playRound(0, 1)
gameLogic.playRound(2, 0)
gameLogic.playRound(0, 2)

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
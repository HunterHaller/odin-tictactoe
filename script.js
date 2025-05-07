// Gameboard object
//  IIFE
//  Contains array that contains all empty spaces that will eventually be 
//      filled with player moves
//  Said array doesn't need to be exposed, as a function that receives an 
//      array index could be used to alter the array, allowing it to remain private.

function Gameboard() {
    const board = [];

    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            
        }
    }
}

// Player X/O object
// Both player objects need to be able to receive input and alter the gameboard.
//     Input will be processed by UI later.
// Instructions note that players are stored in objects, but also I see that in the
//      connect 4 example, they are an object that exists within the game logic obj.
// Need to hold player name and token label? X vs O?

// Game logic object
// IIFE
// This object tracks win conditions by monitoring the board? (Doesn't that then mean
//      that the array must be public? Or is there a function to check for a win?) 

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
// 
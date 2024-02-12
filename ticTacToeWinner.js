export function ticTacToeWinner(board) {
  // Check rows and columns
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== " "
    ) {
      return board[i][0];
    }
    if (
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== " "
    ) {
      return board[0][i];
    }
  }

  // Check diagonals
  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== " "
  ) {
    return board[0][0];
  }
  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== " "
  ) {
    return board[0][2];
  }

  // Check for draw
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        return "Pending"; // Game still in progress
      }
    }
  }

  return "Draw"; // No winner, game is a draw
}

import { ticTacToeWinner } from "./ticTacToeWinner.js";

const board = [
  ["X", "O", "X"],
  ["O", "X", "O"],
  ["X", "O", "X"],
];

console.log(ticTacToeWinner(board)); // Output: Draw

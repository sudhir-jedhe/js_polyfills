# Tic-Tac-Toe in React JS

## Frontend System Design + Complete Interview Explanation

This is one of the most frequently asked React machine-coding questions.

Interviewers typically extend it with:

- Winner detection
- Move history
- Undo/Redo
- Time travel
- NxN board support
- AI opponent

---

# 1. Requirements

## Functional Requirements

✅ 3×3 board

✅ Two players (X and O)

✅ Alternate turns

✅ Detect winner

✅ Detect draw

✅ Prevent overwriting cells

✅ Restart game

---

# 2. Component Design

```txt
App
│
├── Game
│
├── Board
│    │
│    ├── Square
│    ├── Square
│    └── Square
│
└── Game Status
```

---

# 3. State Design

```jsx
const [board, setBoard] = useState(Array(9).fill(null));

const [isXNext, setIsXNext] = useState(true);
```

---

## Board Representation

```txt
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Initial state:

```js
[null, null, null, null, null, null, null, null, null];
```

---

# 4. Winner Detection Logic

Winning combinations:

```js
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];
```

---

## Utility Function

```jsx
function calculateWinner(board) {
  for (let line of WINNING_COMBINATIONS) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}
```

---

# 5. Complete React Code

## App.jsx

```jsx
import { useState } from "react";
import "./styles.css";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ board, onMove }) {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Square key={index} value={cell} onClick={() => onMove(index)} />
      ))}
    </div>
  );
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));

  const [isXNext, setIsXNext] = useState(true);

  const winner = calculateWinner(board);

  const isDraw = !winner && board.every(Boolean);

  function handleMove(index) {
    if (board[index] || winner) {
      return;
    }

    const nextBoard = [...board];

    nextBoard[index] = isXNext ? "X" : "O";

    setBoard(nextBoard);

    setIsXNext((prev) => !prev);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));

    setIsXNext(true);
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <div className="status">
        {winner
          ? `Winner: ${winner}`
          : isDraw
            ? "Draw Game"
            : `Next Player: ${isXNext ? "X" : "O"}`}
      </div>

      <Board board={board} onMove={handleMove} />

      <button className="reset-btn" onClick={resetGame}>
        Restart Game
      </button>
    </div>
  );
}
```

---

# styles.css

```css
.container {
  text-align: center;
  margin-top: 40px;
}

.board {
  width: 300px;

  margin: 20px auto;

  display: grid;

  grid-template-columns: repeat(3, 100px);

  grid-template-rows: repeat(3, 100px);
}

.square {
  font-size: 2rem;

  cursor: pointer;

  border: 1px solid #ccc;

  background: white;
}

.square:hover {
  background: #f5f5f5;
}

.status {
  font-size: 24px;

  margin-bottom: 20px;
}

.reset-btn {
  padding: 10px 20px;

  font-size: 16px;

  cursor: pointer;
}
```

---

# 6. Execution Flow

```txt
User Clicks Square
         │
         ▼
Check Empty?
         │
         ▼
Update Board
         │
         ▼
Switch Player
         │
         ▼
Check Winner
         │
   ┌─────┴─────┐
   │           │
 Yes          No
   │           │
 Winner    Continue
```

---

# 7. Time Complexity

## Move

```txt
O(1)
```

---

## Winner Check

8 combinations.

```txt
O(8)
```

Practically constant.

---

# 8. Follow-Up: Move History (Time Travel)

Common React interview extension.

```jsx
const [history, setHistory] = useState([Array(9).fill(null)]);
```

Store every board state.

```txt
Move 1
Move 2
Move 3
```

User can jump back.

---

# 9. Undo Feature

```jsx
function undo() {
  if (history.length <= 1) {
    return;
  }

  const updated = history.slice(0, history.length - 1);

  setHistory(updated);
}
```

---

# 10. NxN Tic-Tac-Toe

Instead of:

```txt
3x3
```

Interviewers may ask:

```txt
5x5
10x10
```

Use:

```jsx
const SIZE = 5;

Array(SIZE * SIZE);
```

Generate rows/columns dynamically.

Winner check becomes:

```txt
Rows
Columns
Diagonals
```

Computed dynamically.

---

# 11. AI Opponent (Advanced)

Possible answers:

### Easy

```txt
Random move
```

### Medium

```txt
Best available move
```

### Hard

```txt
Minimax Algorithm
```

Used in chess/tic-tac-toe engines.

---

# Common Interview Questions

### Why store board in array?

Simple indexing.

```txt
O(1)
access
```

---

### Why create new array?

```jsx
const nextBoard = [...board];
```

Maintains immutability.

React rerenders correctly.

---

### Why prevent cell overwrite?

```jsx
if (board[index]) return;
```

Avoid invalid moves.

---

### How would you support Undo?

Store every board in history.

---

### How would you support Multiplayer?

Use:

```txt
WebSocket
Socket.IO
```

Synchronise moves across users.

---

# Senior-Level Interview Answer

> Tic-Tac-Toe can be modelled using a one-dimensional board array of size 9 and a current-player state. Every move updates the board immutably, switches the player, and checks predefined winning combinations. The base solution runs in constant time per move. For extensibility, I would separate Board, Square, and Game components, add move history for time travel, support NxN boards through dynamic winner detection, and use WebSockets for multiplayer gameplay. This design keeps the implementation simple, scalable, and easy to test.

# Tic-Tac-Toe: Move History + Undo + NxN Support + AI Opponent

These are the **3 most common follow-up questions** asked after implementing basic Tic-Tac-Toe.

---

# 1. Move History (Time Travel)

## Why?

Store every board state.

Instead of:

```js
const [board, setBoard] = useState(Array(9).fill(null));
```

Store:

```js
const [history, setHistory] = useState([Array(9).fill(null)]);
```

Current board becomes:

```js
const currentMove = history.length - 1;

const currentBoard = history[currentMove];
```

---

## Move Flow

Move 1:

```txt
X
```

History:

```js
[
  [null,null,null...],
  ["X",null,null...]
]
```

---

Move 2:

```txt
X O
```

History:

```js
[Board0, Board1, Board2];
```

---

# Updated Handle Move

```js
function handleMove(index) {
  const currentBoard = history[history.length - 1];

  if (currentBoard[index] || calculateWinner(currentBoard)) {
    return;
  }

  const nextBoard = [...currentBoard];

  nextBoard[index] = xIsNext ? "X" : "O";

  setHistory((prev) => [...prev, nextBoard]);

  setXIsNext((prev) => !prev);
}
```

---

# Move History UI

```jsx
<div>
  <h3>Move History</h3>

  {history.map((_, moveIndex) => (
    <button key={moveIndex} onClick={() => jumpTo(moveIndex)}>
      Move {moveIndex}
    </button>
  ))}
</div>
```

---

# Time Travel Feature

```js
function jumpTo(moveIndex) {
  setCurrentMove(moveIndex);

  setXIsNext(moveIndex % 2 === 0);
}
```

---

# Interview Point

React Official Tutorial uses this approach.

Benefits:

```txt
Undo
Redo
Replay
Debugging
Time Travel
```

---

# 2. Undo Feature

Very common interview follow-up.

---

## Approach

Remove last move.

---

```js
function undoMove() {
  if (history.length <= 1) {
    return;
  }

  setHistory((prev) => prev.slice(0, -1));

  setXIsNext((prev) => !prev);
}
```

---

## Undo Button

```jsx
<button onClick={undoMove}>Undo</button>
```

---

## Example

Before:

```txt
X O X
```

History:

```txt
Move0
Move1
Move2
Move3
```

Undo:

```txt
Move0
Move1
Move2
```

Board rolls back.

---

# Redo Feature

Another extension.

---

Store:

```js
const [redoStack, setRedoStack] = useState([]);
```

Undo:

```js
setRedoStack((prev) => [history.at(-1), ...prev]);
```

Redo:

```js
const lastRedo = redoStack[0];
```

Restore board.

---

# 3. NxN Board Support

Interviewers usually ask:

> How would you support 5x5 board?

---

## Problem

Current board:

```txt
3 x 3
```

Hardcoded.

---

## Make Dynamic

```js
const SIZE = 5;
```

Board:

```js
Array(SIZE * SIZE).fill(null);
```

For 5x5:

```txt
25 cells
```

---

# Dynamic Rendering

```jsx
<div
  style={{
    display: "grid",

    gridTemplateColumns:
      `repeat(${SIZE}, 60px)`
  }}
>
```

---

Result:

```txt
□ □ □ □ □
□ □ □ □ □
□ □ □ □ □
□ □ □ □ □
□ □ □ □ □
```

---

# Dynamic Winner Detection

For NxN:

Need to check:

```txt
Rows
Columns
Diagonals
```

---

## Row Check

```js
function checkRows(board, size) {
  for (let row = 0; row < size; row++) {
    const start = row * size;

    const first = board[start];

    if (!first) continue;

    let winner = true;

    for (let col = 0; col < size; col++) {
      if (board[start + col] !== first) {
        winner = false;
        break;
      }
    }

    if (winner) {
      return first;
    }
  }

  return null;
}
```

---

# Column Check

```js
function checkColumns(board, size) {
  // Similar logic
}
```

---

# Diagonal Check

```js
0  1  2
3  4  5
6  7  8
```

Main diagonal:

```txt
0
4
8
```

Secondary:

```txt
2
4
6
```

Generate indexes dynamically.

---

# Complexity

Current:

```txt
3 x 3
```

Winner:

```txt
O(1)
```

---

NxN:

```txt
Board = N²
```

Winner:

```txt
O(N²)
```

---

# 4. AI Opponent

Most interesting extension.

---

# Level 1: Random AI

Easy implementation.

---

```js
function aiMove(board) {
  const emptyCells = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(Boolean);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  return randomIndex;
}
```

---

AI turn:

```js
setTimeout(() => {
  const move = aiMove(board);

  handleMove(move);
}, 500);
```

---

# Level 2: Smart AI

Rule priority:

```txt
Win if possible
Else block opponent
Else random
```

---

Example:

```txt
X X _
O _ _
O _ _
```

AI:

```txt
Blocks X
```

---

Implementation:

```js
function findWinningMove(board, player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i]) continue;

    const copy = [...board];

    copy[i] = player;

    if (calculateWinner(copy)) {
      return i;
    }
  }

  return null;
}
```

---

AI:

```js
function smartMove(board) {
  return (
    findWinningMove(board, "O") ??
    findWinningMove(board, "X") ??
    randomMove(board)
  );
}
```

---

# Level 3: Minimax Algorithm (Interview Gold)

Used by:

```txt
Chess
Checkers
Tic-Tac-Toe
```

---

## Idea

Simulate every possible future move.

Evaluate:

```txt
AI Wins = +10

Draw = 0

Human Wins = -10
```

Choose best score.

---

```js
function minimax(board, isMaximizing) {
  const winner = calculateWinner(board);

  if (winner === "O") {
    return 10;
  }

  if (winner === "X") {
    return -10;
  }

  // recursive evaluation
}
```

AI becomes unbeatable.

---

# System Design Architecture

```txt
Game
 │
 ├── Board
 │
 ├── History Manager
 │     │
 │     ├── Undo
 │     ├── Redo
 │     └── Time Travel
 │
 ├── Winner Engine
 │
 ├── AI Engine
 │     │
 │     ├── Random
 │     ├── Smart
 │     └── Minimax
 │
 └── Dynamic NxN Support
```

---

# Senior-Level Interview Answer

> I would store board snapshots in a history array to enable undo, redo, and time-travel debugging. The current board is derived from the selected history snapshot. For NxN support, I'd generate the board dynamically and compute row, column, and diagonal winners algorithmically instead of hard-coding winning combinations. For AI, I'd start with a random move generator, then improve it with defensive and offensive heuristics, and finally implement the Minimax algorithm with alpha-beta pruning for an unbeatable opponent. This keeps the solution scalable, extensible, and suitable for production-quality game architecture.

# Tic-Tac-Toe Undo & Redo Implementation

This is one of the most common follow-up questions after implementing basic Tic-Tac-Toe.

The idea is:

```txt
Move 1
Move 2
Move 3
Move 4

Undo
↓
Move 3

Undo
↓
Move 2

Redo
↓
Move 3
```

---

# State Design

Instead of storing only current board:

```jsx
const [board, setBoard] = useState(Array(9).fill(null));
```

Store:

```jsx
const [history, setHistory] = useState([Array(9).fill(null)]);

const [currentMove, setCurrentMove] = useState(0);

const [xIsNext, setXIsNext] = useState(true);
```

---

# Current Board

```jsx
const board = history[currentMove];
```

Example:

```txt
history = [
  Board0,
  Board1,
  Board2,
  Board3
]

currentMove = 3

Current Board = Board3
```

---

# Handle Move

Whenever user clicks a square:

```jsx
function handleMove(index) {
  const currentBoard = history[currentMove];

  if (currentBoard[index]) {
    return;
  }

  const nextBoard = [...currentBoard];

  nextBoard[index] = xIsNext ? "X" : "O";

  const updatedHistory = history.slice(0, currentMove + 1);

  setHistory([...updatedHistory, nextBoard]);

  setCurrentMove(updatedHistory.length);

  setXIsNext((prev) => !prev);
}
```

---

# Why Slice?

Suppose:

```txt
Move1
Move2
Move3
Move4
```

Undo twice:

```txt
Move1
Move2
```

Now make a new move.

We must remove:

```txt
Move3
Move4
```

because timeline changed.

That's why:

```jsx
history.slice(0, currentMove + 1);
```

---

# Undo Button

```jsx
function undoMove() {
  if (currentMove === 0) {
    return;
  }

  setCurrentMove((prev) => prev - 1);

  setXIsNext(currentMove % 2 === 0);
}
```

---

# Redo Button

```jsx
function redoMove() {
  if (currentMove === history.length - 1) {
    return;
  }

  setCurrentMove((prev) => prev + 1);

  setXIsNext(currentMove % 2 !== 0);
}
```

---

# Better Version

```jsx
function undoMove() {
  if (currentMove > 0) {
    const prevMove = currentMove - 1;

    setCurrentMove(prevMove);

    setXIsNext(prevMove % 2 === 0);
  }
}
```

---

```jsx
function redoMove() {
  if (currentMove < history.length - 1) {
    const nextMove = currentMove + 1;

    setCurrentMove(nextMove);

    setXIsNext(nextMove % 2 === 0);
  }
}
```

---

# Undo & Redo Buttons

```jsx
<div className="controls">
  <button onClick={undoMove} disabled={currentMove === 0}>
    Undo
  </button>

  <button onClick={redoMove} disabled={currentMove === history.length - 1}>
    Redo
  </button>
</div>
```

---

# Move History UI

```jsx
<div className="history">
  <h3>Move History</h3>

  {history.map((_, move) => (
    <button
      key={move}
      onClick={() => {
        setCurrentMove(move);

        setXIsNext(move % 2 === 0);
      }}
    >
      Go To Move {move}
    </button>
  ))}
</div>
```

---

# Complete Example

```jsx
import { useState } from "react";

export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);

  const [xIsNext, setXIsNext] = useState(true);

  const board = history[currentMove];

  function handleMove(index) {
    if (board[index]) {
      return;
    }

    const nextBoard = [...board];

    nextBoard[index] = xIsNext ? "X" : "O";

    const nextHistory = history.slice(0, currentMove + 1);

    setHistory([...nextHistory, nextBoard]);

    setCurrentMove(nextHistory.length);

    setXIsNext((prev) => !prev);
  }

  function undoMove() {
    if (currentMove > 0) {
      const move = currentMove - 1;

      setCurrentMove(move);

      setXIsNext(move % 2 === 0);
    }
  }

  function redoMove() {
    if (currentMove < history.length - 1) {
      const move = currentMove + 1;

      setCurrentMove(move);

      setXIsNext(move % 2 === 0);
    }
  }

  return (
    <>
      <h2>
        Next Player:
        {xIsNext ? "X" : "O"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 60px)",
        }}
      >
        {board.map((value, index) => (
          <button key={index} onClick={() => handleMove(index)}>
            {value}
          </button>
        ))}
      </div>

      <button onClick={undoMove} disabled={currentMove === 0}>
        Undo
      </button>

      <button onClick={redoMove} disabled={currentMove === history.length - 1}>
        Redo
      </button>
    </>
  );
}
```

---

# Interview Explanation

### Why store history?

```txt
Undo
Redo
Time Travel
Replay Moves
Debugging
```

---

### Complexity

#### Move

```txt
O(n)
```

Because board copy:

```js
[...board];
```

---

#### Undo

```txt
O(1)
```

Only changing pointer:

```js
currentMove--;
```

---

#### Redo

```txt
O(1)
```

Only moving forward in history.

---

# Senior-Level Interview Answer

> Instead of storing only the current board state, I keep an array of board snapshots called `history`. The current board is derived using a `currentMove` pointer. Undo and redo become O(1) operations because they only move the pointer backward or forward rather than recalculating the board. This approach also enables time travel, replay functionality, debugging, and move history visualisation, which is the same architecture used in the official React Tic-Tac-Toe tutorial.

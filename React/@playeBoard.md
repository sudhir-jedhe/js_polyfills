For the **Devtools Tech: Build a Two-Player Line Board Game** challenge, the publicly available description indicates that it's a board-game UI challenge focused on implementing game logic, state transitions, component architecture, and UX on a **12×12 board**. [\[devtools.tech\]](https://devtools.tech/questions/s/build-a-two-player-line-board-game---qid---lIas2ZwR8dMHDjbpxICA), [\[linkedin.com\]](https://www.linkedin.com/posts/yomeshgupta_devtools-tech-added-this-interesting-ui-challenge-activity-7330817051638358016-qkHM)

Since the full problem statement is behind the challenge page and isn't available in the search results, I can only describe a solution based on the information explicitly visible:

## Likely Requirements

```text
Board Size: 12 x 12

Players:
P1 = X
P2 = O

Turns:
Alternate turns

Goal:
Create a continuous line
```

The exact win condition (5-in-a-row, connect-all, longest line, etc.) is **not specified** in the accessible source, so I won't invent it. [\[devtools.tech\]](https://devtools.tech/questions/s/build-a-two-player-line-board-game---qid---lIas2ZwR8dMHDjbpxICA)

***

# Recommended React Design

## State Model

```ts
type Player = "X" | "O";

interface GameState {
  board: Player[][];
  currentPlayer: Player;
  winner: Player | null;
}
```

***

# Board Initialization

```js
const createBoard = () =>
  Array(12)
    .fill(null)
    .map(() =>
      Array(12).fill(null)
    );
```

***

# Component Structure

```text
App
 │
 ▼
Game
 │
 ├── ScoreBoard
 ├── CurrentTurn
 │
 ▼
Board
 │
 └── Cell
```

***

# Board Rendering

```tsx
function Board({
  board,
  onCellClick,
}) {
  return (
    <div className="board">
      {board.map(
        (
          row,
          rowIndex
        ) =>
          row.map(
            (
              cell,
              colIndex
            ) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onClick={() =>
                  onCellClick(
                    rowIndex,
                    colIndex
                  )
                }
              />
            )
          )
      )}
    </div>
  );
}
```

***

# Move Logic

```js
function handleMove(
  row,
  col
) {
  if (
    board[row][col] ||
    winner
  ) {
    return;
  }

  const updated =
    board.map(r => [...r]);

  updated[row][col] =
    currentPlayer;

  setBoard(updated);

  setCurrentPlayer(
    currentPlayer ===
      "X"
      ? "O"
      : "X"
  );
}
```

***

# Winning Pattern Detection

For any "line board game", you'll usually check:

```text
Horizontal
Vertical
Diagonal ↘
Diagonal ↗
```

Example directions:

```js
const directions = [
  [0, 1],     // horizontal
  [1, 0],     // vertical
  [1, 1],     // diagonal
  [1, -1],    // reverse diagonal
];
```

***

# Generic Line Counter

```js
function countLine(
  board,
  row,
  col,
  dx,
  dy,
  player
) {
  let count = 0;

  let r = row;
  let c = col;

  while (
    board[r]?.[c] === player
  ) {
    count++;
    r += dx;
    c += dy;
  }

  return count;
}
```

***

# UI Grid

```css
.board {
  display: grid;

  grid-template-columns:
    repeat(12, 40px);

  gap: 2px;
}

.cell {
  width: 40px;
  height: 40px;

  border: 1px solid #ccc;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}
```

***

# What Interviewers Usually Evaluate

The challenge author explicitly mentions evaluating:

* Clean, modular code
* Correct game logic
* State management
* Component architecture
* Responsive UI/UX [\[linkedin.com\]](https://www.linkedin.com/posts/yomeshgupta_devtools-tech-added-this-interesting-ui-challenge-activity-7330817051638358016-qkHM)

***

# Senior-Level Enhancements

If time permits:

✅ Undo Move

✅ Restart Game

✅ Move History

✅ Highlight Winning Path

✅ Timer Per Player

✅ Keyboard Navigation

✅ Persistent Game State

✅ Responsive Mobile Layout

***

## Interview Strategy

For a 60–90 minute machine coding round:

1. Build the 12×12 grid first.
2. Implement turn switching.
3. Implement move validation.
4. Implement line detection.
5. Show winner state.
6. Add UX polish (hover, highlight, reset).

That sequence usually gets the maximum score because it demonstrates both functional correctness and good React architecture. [\[linkedin.com\]](https://www.linkedin.com/posts/yomeshgupta_devtools-tech-added-this-interesting-ui-challenge-activity-7330817051638358016-qkHM)

If you can paste the **full challenge statement**, I can provide the **complete React solution with game logic, win detection, and optimised component structure** tailored to the exact rules.

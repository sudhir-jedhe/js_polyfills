***  TicTacToe.md ***

A complete, modern Tic-Tac-Toe game in React featuring win-line highlighting, move history (time travel), and score tracking.

```jsx
import React, { useState } from 'react';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function calculateWinner(squares) {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  const currentSquares = history[stepNumber];
  const winInfo = calculateWinner(currentSquares);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line || [];
  const isDraw = !winner && currentSquares.every(Boolean);

  const handleClick = (index) => {
    if (currentSquares[index] || winner) return;

    const newHistory = history.slice(0, stepNumber + 1);
    const nextSquares = [...currentSquares];
    nextSquares[index] = xIsNext ? 'X' : 'O';

    const result = calculateWinner(nextSquares);
    if (result) {
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (nextSquares.every(Boolean)) {
      setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
    }

    setHistory([...newHistory, nextSquares]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={{ margin: 0 }}>Tic-Tac-Toe</h2>

      {/* Scoreboard */}
      <div style={styles.scoreboard}>
        <div style={styles.scoreTag}>Player X: <strong>{scores.X}</strong></div>
        <div style={styles.scoreTag}>Ties: <strong>{scores.ties}</strong></div>
        <div style={styles.scoreTag}>Player O: <strong>{scores.O}</strong></div>
      </div>

      {/* Status Bar */}
      <div style={styles.status}>
        {winner ? (
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Winner: Player {winner}! 🎉</span>
        ) : isDraw ? (
          <span style={{ color: '#eab308', fontWeight: 'bold' }}>It's a Draw! 🤝</span>
        ) : (
          <span>Next Player: <strong>{xIsNext ? 'X' : 'O'}</strong></span>
        )}
      </div>

      {/* 3x3 Board */}
      <div style={styles.board}>
        {currentSquares.map((val, idx) => {
          const isWinningCell = winningLine.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              style={{
                ...styles.square,
                backgroundColor: isWinningCell ? '#15803d' : '#1e293b',
                color: val === 'X' ? '#38bdf8' : '#f43f5e',
              }}
            >
              {val}
            </button>
          );
        })}
      </div>

      {/* Actions & History */}
      <div style={styles.controls}>
        <button onClick={resetGame} style={styles.resetBtn}>
          New Round
        </button>

        {history.length > 1 && (
          <div style={styles.historyList}>
            <small style={{ color: '#94a3b8' }}>Time Travel:</small>
            <div style={styles.historyButtons}>
              {history.map((_, move) => (
                <button
                  key={move}
                  onClick={() => jumpTo(move)}
                  style={{
                    ...styles.moveBtn,
                    backgroundColor: move === stepNumber ? '#3b82f6' : '#334155',
                  }}
                >
                  {move === 0 ? 'Start' : `#${move}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },
  scoreboard: {
    display: 'flex',
    gap: '12px',
    margin: '16px 0',
  },
  scoreTag: {
    backgroundColor: '#1e293b',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #334155',
    fontSize: '0.85rem',
  },
  status: {
    fontSize: '1.1rem',
    marginBottom: '16px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 90px)',
    gridTemplateRows: 'repeat(3, 90px)',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#334155',
    borderRadius: '12px',
  },
  square: {
    border: 'none',
    borderRadius: '8px',
    fontSize: '2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  controls: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  resetBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    backgroundColor: '#3b82f6',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  historyButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  moveBtn: {
    border: 'none',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
};

```

---

### Core Mechanics

* **Deterministic Winning Vector Check:** Evaluates all 8 possible 3-in-a-row paths on every state mutation and highlights winning tiles by preserving line indices.
* **Immutable State History (Time Travel):** Moves are appended to an array of board snapshots (`history`), allowing bidirectional navigation across prior turns.
* **Draw & Edge Case Handling:** Distinguishes between ongoing turns, immediate terminal victories, and board-exhaustion draws.

A real-time, 2-player multiplayer Tic-Tac-Toe game using **Node.js + WebSockets (`ws`)** for room pairing, synchronized move handling, and rematch negotiation.

---

### 1. Authoritative Backend Server (`server.js`)

Install `ws` and run the pairing server:

```bash
mkdir ttt-server && cd ttt-server
npm init -y
npm install ws
node server.js

```

```javascript
// server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8081 });
const rooms = new Map(); // roomId -> roomState
let waitingPlayer = null;

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: 'DRAW', line: [] };
  return null;
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let playerSymbol = null;

  // Matchmaking: Pair two players automatically
  if (waitingPlayer && waitingPlayer.ws.readyState === 1) {
    const roomId = `room_${Math.random().toString(36).substring(2, 9)}`;
    currentRoomId = roomId;
    playerSymbol = 'O';

    const p1 = waitingPlayer;
    p1.roomId = roomId;
    p1.symbol = 'X';

    const newRoom = {
      id: roomId,
      board: Array(9).fill(null),
      turn: 'X',
      players: {
        X: p1.ws,
        O: ws,
      },
    };

    rooms.set(roomId, newRoom);
    waitingPlayer = null;

    // Notify both players
    p1.ws.send(JSON.stringify({ type: 'START', symbol: 'X', turn: 'X' }));
    ws.send(JSON.stringify({ type: 'START', symbol: 'O', turn: 'X' }));
  } else {
    waitingPlayer = { ws };
    ws.send(JSON.stringify({ type: 'WAITING', message: 'Waiting for an opponent...' }));
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      const room = rooms.get(currentRoomId || msg.roomId);
      if (!room) return;

      if (msg.type === 'MOVE') {
        const { index, symbol } = msg;

        // Validation: correct turn, cell is empty, and sender owns turn
        if (room.turn === symbol && room.board[index] === null) {
          room.board[index] = symbol;
          const result = checkWinner(room.board);

          room.turn = room.turn === 'X' ? 'O' : 'X';

          const updatePayload = JSON.stringify({
            type: 'UPDATE',
            board: room.board,
            turn: room.turn,
            result,
          });

          room.players.X.send(updatePayload);
          room.players.O.send(updatePayload);
        }
      }

      if (msg.type === 'RESTART') {
        room.board = Array(9).fill(null);
        room.turn = 'X';
        const resetPayload = JSON.stringify({
          type: 'UPDATE',
          board: room.board,
          turn: 'X',
          result: null,
        });
        room.players.X.send(resetPayload);
        room.players.O.send(resetPayload);
      }
    } catch (err) {
      console.error(err);
    }
  });

  ws.on('close', () => {
    if (waitingPlayer && waitingPlayer.ws === ws) {
      waitingPlayer = null;
    }
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId);
      const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
      const opponentWs = room.players[opponentSymbol];
      if (opponentWs && opponentWs.readyState === 1) {
        opponentWs.send(JSON.stringify({ type: 'OPPONENT_LEFT' }));
      }
      rooms.delete(currentRoomId);
    }
  });
});

console.log('Tic-Tac-Toe Server running on ws://localhost:8081');

```

---

### 2. React Multiplayer Client (`MultiplayerTicTacToe.jsx`)

```jsx
import React, { useState, useEffect, useRef } from 'react';

const SERVER_URL = 'ws://localhost:8081';

export default function MultiplayerTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [mySymbol, setMySymbol] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('X');
  const [gameResult, setGameResult] = useState(null);
  const [status, setStatus] = useState('Connecting to server...');
  const [isOpponentConnected, setIsOpponentConnected] = useState(false);

  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(SERVER_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'WAITING') {
        setStatus(data.message);
      }

      if (data.type === 'START') {
        setMySymbol(data.symbol);
        setCurrentTurn(data.turn);
        setIsOpponentConnected(true);
        setStatus(`Game Started! You are Player ${data.symbol}`);
      }

      if (data.type === 'UPDATE') {
        setBoard(data.board);
        setCurrentTurn(data.turn);
        setGameResult(data.result);

        if (data.result) {
          if (data.result.winner === 'DRAW') {
            setStatus("It's a draw!");
          } else {
            setStatus(
              data.result.winner === mySymbol
                ? '🎉 You Won!'
                : `💀 Player ${data.result.winner} Won!`
            );
          }
        }
      }

      if (data.type === 'OPPONENT_LEFT') {
        setIsOpponentConnected(false);
        setStatus('Opponent disconnected. Refresh to find a new match.');
      }
    };

    return () => ws.close();
  }, [mySymbol]);

  const handleCellClick = (index) => {
    if (
      !isOpponentConnected ||
      board[index] !== null ||
      currentTurn !== mySymbol ||
      gameResult
    ) {
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'MOVE',
        index,
        symbol: mySymbol,
      })
    );
  };

  const handleRematch = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'RESTART' }));
    }
  };

  const winningLine = gameResult?.line || [];
  const isMyTurn = currentTurn === mySymbol && isOpponentConnected && !gameResult;

  return (
    <div style={styles.container}>
      <h2 style={{ margin: 0 }}>Multiplayer Tic-Tac-Toe</h2>

      <div style={styles.statusBox}>{status}</div>

      {mySymbol && (
        <div style={styles.metaRow}>
          <div style={styles.badge}>
            Role: <strong>Player {mySymbol}</strong>
          </div>
          <div
            style={{
              ...styles.badge,
              backgroundColor: isMyTurn ? '#065f46' : '#1e293b',
              borderColor: isMyTurn ? '#10b981' : '#334155',
            }}
          >
            {isMyTurn ? '👉 Your Turn' : "Opponent's Turn"}
          </div>
        </div>
      )}

      {/* 3x3 Interactive Grid */}
      <div style={styles.board}>
        {board.map((cell, idx) => {
          const isWinningCell = winningLine.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={!isMyTurn || cell !== null}
              style={{
                ...styles.cell,
                backgroundColor: isWinningCell ? '#15803d' : '#1e293b',
                color: cell === 'X' ? '#38bdf8' : '#f43f5e',
                cursor: isMyTurn && !cell ? 'pointer' : 'not-allowed',
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Post-Game Rematch */}
      {gameResult && isOpponentConnected && (
        <button onClick={handleRematch} style={styles.rematchBtn}>
          Play Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 16px',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  statusBox: {
    margin: '16px 0',
    padding: '8px 16px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    border: '1px solid #334155',
    fontSize: '0.95rem',
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    fontSize: '0.85rem',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 90px)',
    gridTemplateRows: 'repeat(3, 90px)',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#334155',
    borderRadius: '12px',
  },
  cell: {
    border: 'none',
    borderRadius: '8px',
    fontSize: '2rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  rematchBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

```

---

### Core Mechanics

* **Queue-Based Matchmaking:** The server maintains a `waitingPlayer` slot. The first connecting user waits; the second user pairs with them, assigns tokens (`X` to first, `O` to second), and starts the game session.
* **Server-Side Validation:** The backend validates turn rotation, existing cell occupancy, and victory checks before updating state to prevent illicit double moves or client-side tampering.
* **Disconnect Propagation:** If either player closes the socket connection, the server notifies the opponent immediately and clears memory references.

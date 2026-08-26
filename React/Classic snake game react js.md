*** copy Classic snake game react js.md ***

A complete, responsive Classic Snake Game built in React with grid rendering, directional controls, self-collision and wall-collision detection, high scores, and food generation.

---

### 1. Snake Game Component (`SnakeGame.jsx`)

```jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20; // 20x20 grid
const INITIAL_SPEED = 130; // ms per tick
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP initially

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_high_score') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Store current direction in a ref to prevent 180-degree self-turn bugs
  const dirRef = useRef(INITIAL_DIRECTION);
  dirRef.current = direction;

  // Generate food that doesn't overlap the snake body
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collidesWithSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collidesWithSnake) break;
    }
    return newFood;
  }, []);

  // Reset Game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    dirRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling
      }

      if (e.key === ' ' || e.key.toLowerCase() === 'p') {
        if (!isGameOver) setIsPaused((prev) => !prev);
        return;
      }

      if (isGameOver || isPaused) return;

      const current = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  // Main Game Loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // 1. Check Wall Collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // 2. Check Self Collisions
        const hitSelf = prevSnake.some(
          (seg) => seg.x === newHead.x && seg.y === newHead.y
        );
        if (hitSelf) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 3. Check Food Consumption
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => {
            const nextScore = prev + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_high_score', nextScore.toString());
            }
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const handleGameOver = () => {
      setIsGameOver(true);
    };

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, highScore, generateFood]);

  return (
    <div style={styles.container}>
      {/* Score Header */}
      <div style={styles.header}>
        <div>Score: <strong>{score}</strong></div>
        <div>High Score: <strong>{highScore}</strong></div>
      </div>

      {/* Board */}
      <div style={styles.boardWrapper}>
        <div style={styles.board}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody =
              !isHead && snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            let cellBg = '#1e293b'; // Default empty tile
            if (isHead) cellBg = '#22c55e'; // Bright green head
            else if (isBody) cellBg = '#15803d'; // Green body
            else if (isFood) cellBg = '#ef4444'; // Red food

            return (
              <div
                key={index}
                style={{
                  ...styles.cell,
                  backgroundColor: cellBg,
                  borderRadius: isFood || isHead ? '50%' : '3px',
                  boxShadow: isFood
                    ? '0 0 8px #ef4444'
                    : isHead
                    ? '0 0 6px #22c55e'
                    : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Overlay for Game Over / Pause */}
        {(isGameOver || isPaused) && (
          <div style={styles.overlay}>
            {isGameOver ? (
              <>
                <h2 style={{ color: '#ef4444', margin: '0 0 8px 0' }}>Game Over!</h2>
                <p style={{ margin: '0 0 16px 0', color: '#cbd5e1' }}>Final Score: {score}</p>
                <button onClick={resetGame} style={styles.actionBtn}>
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>Paused</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  style={styles.actionBtn}
                >
                  Resume
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-Screen Mobile / Arrow Controls */}
      <div style={styles.controlGrid}>
        <div />
        <button
          onClick={() => dirRef.current.y === 0 && setDirection({ x: 0, y: -1 })}
          style={styles.dirBtn}
        >
          ▲
        </button>
        <div />

        <button
          onClick={() => dirRef.current.x === 0 && setDirection({ x: -1, y: 0 })}
          style={styles.dirBtn}
        >
          ◀
        </button>
        <button
          onClick={() => !isGameOver && setIsPaused((prev) => !prev)}
          style={{ ...styles.dirBtn, backgroundColor: '#334155', fontSize: '0.8rem' }}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        <button
          onClick={() => dirRef.current.x === 0 && setDirection({ x: 1, y: 0 })}
          style={styles.dirBtn}
        >
          ▶
        </button>

        <div />
        <button
          onClick={() => dirRef.current.y === 0 && setDirection({ x: 0, y: 1 })}
          style={styles.dirBtn}
        >
          ▼
        </button>
        <div />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    userSelect: 'none',
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '320px',
    marginBottom: '12px',
    fontSize: '1rem',
    color: '#94a3b8',
  },
  boardWrapper: {
    position: 'relative',
    padding: '6px',
    backgroundColor: '#334155',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 16px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 16px)`,
    gap: '1px',
    backgroundColor: '#0f172a',
  },
  cell: {
    width: '16px',
    height: '16px',
    transition: 'background-color 0.05s ease',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
  },
  actionBtn: {
    padding: '10px 20px',
    backgroundColor: '#22c55e',
    color: '#0f172a',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 48px)',
    gridTemplateRows: 'repeat(3, 48px)',
    gap: '8px',
    marginTop: '20px',
  },
  dirBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
};

```

---

### Core Mechanics

* **Direction Guarding via `useRef`:** Fast double-clicks (e.g., pressing `Right` then `Down` in the same tick) are checked against `dirRef.current` rather than stale closure state, preventing the snake from turning 180 degrees into itself.
* **Collision Math:** Boundary bounds check $0 \le x < \text{GRID\_SIZE}$ and $0 \le y < \text{GRID\_SIZE}$, and array `.some()` tracks self-intersections.
* **O(1) Tail Progression:** Instead of updating every segment manually, a new head is placed at index `0` and `.pop()` removes the tail unless food was consumed.

A real-time, 2-player multiplayer Snake game using **WebSockets (`ws`)** and a **Node.js** backend authoritative server to synchronize game states and handle collisions.

---

### 1. Backend Server (`server.js`)

Run this Node.js authoritative game loop to manage rooms, detect multi-snake collisions, and broadcast coordinates.

```bash
# Setup backend dependencies
mkdir snake-server && cd snake-server
npm init -y
npm install ws

```

```javascript
// server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
const GRID_SIZE = 25;
const TICK_RATE = 100; // ms per frame

let rooms = {}; // roomId -> roomState

function createInitialState() {
  return {
    players: {},
    food: { x: 12, y: 12 },
    isStarted: false,
  };
}

function spawnFood(players) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const collides = Object.values(players).some((p) =>
      p.snake.some((s) => s.x === food.x && s.y === food.y)
    );
    if (!collides) return food;
  }
}

wss.on('connection', (ws) => {
  let currentRoom = 'default';
  let playerId = Math.random().toString(36).substring(2, 9);

  if (!rooms[currentRoom]) {
    rooms[currentRoom] = createInitialState();
  }

  const room = rooms[currentRoom];
  const playerCount = Object.keys(room.players).length;

  if (playerCount >= 2) {
    ws.send(JSON.stringify({ type: 'ROOM_FULL' }));
    ws.close();
    return;
  }

  // Setup player coordinates
  const isPlayer1 = playerCount === 0;
  room.players[playerId] = {
    ws,
    snake: isPlayer1
      ? [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }]
      : [{ x: 19, y: 19 }, { x: 19, y: 18 }, { x: 19, y: 17 }],
    dir: isPlayer1 ? { x: 0, y: -1 } : { x: 0, y: 1 },
    score: 0,
    alive: true,
    color: isPlayer1 ? '#3b82f6' : '#ef4444',
  };

  ws.send(JSON.stringify({ type: 'INIT', playerId, gridSize: GRID_SIZE }));

  // Handle Input Commands
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'CHANGE_DIR' && room.players[playerId]?.alive) {
        const current = room.players[playerId].dir;
        // Prevent 180° turns
        if (msg.dir.x !== -current.x && msg.dir.y !== -current.y) {
          room.players[playerId].dir = msg.dir;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Start loop once 2 players enter
  if (Object.keys(room.players).length === 2 && !room.isStarted) {
    room.isStarted = true;
    startGameLoop(currentRoom);
  }

  ws.on('close', () => {
    delete room.players[playerId];
    if (Object.keys(room.players).length === 0) {
      clearInterval(room.interval);
      delete rooms[currentRoom];
    }
  });
});

function startGameLoop(roomId) {
  const room = rooms[roomId];

  room.interval = setInterval(() => {
    const pKeys = Object.keys(room.players);
    if (pKeys.length < 2) return;

    // 1. Move active snakes
    pKeys.forEach((id) => {
      const p = room.players[id];
      if (!p.alive) return;

      const head = p.snake[0];
      const newHead = { x: head.x + p.dir.x, y: head.y + p.dir.y };

      // Wall bounds collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        p.alive = false;
        return;
      }

      // Self & Opponent collision
      pKeys.forEach((otherId) => {
        const otherSnake = room.players[otherId].snake;
        if (otherSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          p.alive = false;
        }
      });

      if (!p.alive) return;

      p.snake.unshift(newHead);

      // Food check
      if (newHead.x === room.food.x && newHead.y === room.food.y) {
        p.score += 10;
        room.food = spawnFood(room.players);
      } else {
        p.snake.pop();
      }
    });

    // 2. Broadcast State
    const snapshot = {
      type: 'TICK',
      food: room.food,
      players: Object.fromEntries(
        Object.entries(room.players).map(([id, p]) => [
          id,
          { snake: p.snake, score: p.score, alive: p.alive, color: p.color },
        ])
      ),
    };

    pKeys.forEach((id) => {
      if (room.players[id].ws.readyState === 1) {
        room.players[id].ws.send(JSON.stringify(snapshot));
      }
    });
  }, TICK_RATE);
}

console.log('Multiplayer Snake Server running on ws://localhost:8080');

```

---

### 2. React Multiplayer Client (`MultiplayerSnake.jsx`)

```jsx
import React, { useState, useEffect, useRef } from 'react';

const SERVER_URL = 'ws://localhost:8080';
const GRID_SIZE = 25;

export default function MultiplayerSnake() {
  const [playerId, setPlayerId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [status, setStatus] = useState('Connecting to server...');
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus('Connected. Waiting for Player 2...');

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'INIT') {
        setPlayerId(msg.playerId);
      } else if (msg.type === 'ROOM_FULL') {
        setStatus('Room is currently full. Try again later.');
      } else if (msg.type === 'TICK') {
        setGameState(msg);
        setStatus('Game Live!');
      }
    };

    ws.onclose = () => setStatus('Disconnected from server.');

    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        return;
      }
      e.preventDefault();

      let dir = null;
      if (e.key === 'ArrowUp' || e.key === 'w') dir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' || e.key === 's') dir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' || e.key === 'a') dir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' || e.key === 'd') dir = { x: 1, y: 0 };

      if (dir && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'CHANGE_DIR', dir }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ws.close();
    };
  }, []);

  const players = gameState?.players || {};
  const isPlaying = Object.keys(players).length === 2;

  return (
    <div style={styles.container}>
      <h2>Multiplayer Snake (Real-Time)</h2>
      <div style={styles.statusBar}>{status}</div>

      {/* Scoreboard */}
      <div style={styles.scoreRow}>
        {Object.entries(players).map(([id, p], index) => (
          <div
            key={id}
            style={{
              ...styles.scoreBadge,
              borderColor: p.color,
              color: p.color,
              fontWeight: id === playerId ? 'bold' : 'normal',
            }}
          >
            Player {index + 1} {id === playerId ? '(You)' : ''}: {p.score} pts
            {!p.alive && ' [ELIMINATED]'}
          </div>
        ))}
      </div>

      {/* Grid Canvas */}
      <div style={styles.gridWrapper}>
        <div style={styles.board}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isFood = gameState?.food?.x === x && gameState?.food?.y === y;
            let cellBg = '#1e293b';

            // Check snakes
            Object.values(players).forEach((p) => {
              if (p.snake.some((seg) => seg.x === x && seg.y === y)) {
                cellBg = p.color;
              }
            });

            if (isFood) cellBg = '#eab308'; // Food token

            return (
              <div
                key={index}
                style={{
                  ...styles.cell,
                  backgroundColor: cellBg,
                  borderRadius: isFood ? '50%' : '2px',
                  boxShadow: isFood ? '0 0 8px #eab308' : 'none',
                }}
              />
            );
          })}
        </div>
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
  statusBar: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '16px',
  },
  scoreRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  scoreBadge: {
    padding: '6px 14px',
    border: '2px solid',
    borderRadius: '8px',
    backgroundColor: '#1e293b',
    fontSize: '0.85rem',
  },
  gridWrapper: {
    padding: '8px',
    backgroundColor: '#334155',
    borderRadius: '12px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 14px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 14px)`,
    gap: '1px',
    backgroundColor: '#0f172a',
  },
  cell: {
    width: '14px',
    height: '14px',
  },
};

```

---

### Core Mechanics

* **Server Authoritative Architecture:** Game logic (movement ticks, collision checks, score increments) lives exclusively on the Node backend. Clients act solely as input controllers and render viewports.
* **Synchronous Frame Broadcasts:** The server loops at $100\text{ms}$ ticks, sending full synchronized coordinate frames over WebSocket payloads (`TICK`), preventing player de-sync.
* **Mutual Head-to-Body Collision:** Player 1 dies if their head touches any segment of Player 2's body, and vice versa.

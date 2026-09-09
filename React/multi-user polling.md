***  multi-user polling.md ***

A complete, real-time multi-user polling application featuring a lightweight **Node.js + WebSockets** backend and a **React** client with live voting percentages, progress bars, and duplicate vote prevention.

---

### 1. WebSocket Backend Server (`server.js`)

Install `ws` and run the backend broadcast server:

```bash
mkdir poll-server && cd poll-server
npm init -y
npm install ws
node server.js

```

```javascript
// server.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8082 });

// Global poll state
let pollData = {
  question: 'Which frontend framework/library do you prefer most in 2026?',
  options: [
    { id: 1, text: 'React', votes: 12 },
    { id: 2, text: 'Next.js', votes: 8 },
    { id: 3, text: 'Vue / Nuxt', votes: 5 },
    { id: 4, text: 'Svelte / SvelteKit', votes: 4 },
  ],
};

function broadcastPollState() {
  const payload = JSON.stringify({ type: 'POLL_UPDATE', data: pollData });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws) => {
  // Send the current poll snapshot immediately upon connection
  ws.send(JSON.stringify({ type: 'POLL_UPDATE', data: pollData }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);

      if (parsed.type === 'VOTE') {
        const option = pollData.options.find((opt) => opt.id === parsed.optionId);
        if (option) {
          option.votes += 1;
          broadcastPollState();
        }
      }

      if (parsed.type === 'RESET') {
        pollData.options = pollData.options.map((opt) => ({ ...opt, votes: 0 }));
        broadcastPollState();
      }
    } catch (err) {
      console.error('Invalid message received:', err);
    }
  });
});

console.log('Poll server running on ws://localhost:8082');

```

---

### 2. React Multi-User Poll Component (`LivePoll.jsx`)

```jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';

const WS_URL = 'ws://localhost:8082';

export default function LivePoll() {
  const [poll, setPoll] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(() => {
    return localStorage.getItem('user_voted_option') || null;
  });
  const [status, setStatus] = useState('Connecting to live poll...');
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus('Connected (Live Updates)');
    ws.onclose = () => setStatus('Disconnected from server');

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'POLL_UPDATE') {
        setPoll(data);
      }
    };

    return () => ws.close();
  }, []);

  // Compute total votes
  const totalVotes = useMemo(() => {
    if (!poll) return 0;
    return poll.options.reduce((acc, opt) => acc + opt.votes, 0);
  }, [poll]);

  // Handle Casting a Vote
  const handleVote = (optionId) => {
    if (selectedOptionId || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({ type: 'VOTE', optionId }));
    setSelectedOptionId(optionId);
    localStorage.setItem('user_voted_option', optionId.toString());
  };

  // Reset local vote state (for testing)
  const handleClearLocalVote = () => {
    setSelectedOptionId(null);
    localStorage.removeItem('user_voted_option');
  };

  if (!poll) {
    return <div style={styles.container}>{status}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.statusBadge}>● {status}</div>
          <h2 style={styles.question}>{poll.question}</h2>
          <span style={styles.totalCount}>Total Votes: {totalVotes}</span>
        </div>

        <div style={styles.optionsList}>
          {poll.options.map((opt) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
            const isUserChoice = String(selectedOptionId) === String(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                style={{
                  ...styles.optionCard,
                  cursor: selectedOptionId ? 'default' : 'pointer',
                  borderColor: isUserChoice ? '#2563eb' : '#e2e8f0',
                }}
              >
                {/* Visual Progress Bar Fill */}
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${percentage}%`,
                    backgroundColor: isUserChoice ? '#dbeafe' : '#f1f5f9',
                  }}
                />

                {/* Option Content */}
                <div style={styles.optionContent}>
                  <div style={styles.labelGroup}>
                    <span style={styles.optionText}>{opt.text}</span>
                    {isUserChoice && <span style={styles.youBadge}>Your Vote</span>}
                  </div>
                  <div style={styles.statsGroup}>
                    <span style={styles.percentText}>{percentage}%</span>
                    <span style={styles.voteText}>({opt.votes})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & test controls */}
        <div style={styles.footer}>
          {selectedOptionId ? (
            <div style={styles.footerNote}>
              <span>✓ Your vote has been recorded in real-time.</span>
              <button onClick={handleClearLocalVote} style={styles.linkBtn}>
                Clear Local Vote
              </button>
            </div>
          ) : (
            <span style={{ color: '#64748b' }}>Click an option above to cast your vote.</span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    color: '#0f172a',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    height: 'fit-content',
  },
  header: {
    marginBottom: '20px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: '8px',
  },
  question: {
    margin: '0 0 8px 0',
    fontSize: '1.25rem',
    fontWeight: '700',
    lineHeight: '1.4',
  },
  totalCount: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionCard: {
    position: 'relative',
    border: '2px solid',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'border-color 0.2s, transform 0.1s',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    transition: 'width 0.4s ease',
    zIndex: 1,
  },
  optionContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
  },
  labelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  optionText: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  youBadge: {
    fontSize: '0.7rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  statsGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  percentText: {
    fontWeight: '700',
    fontSize: '1rem',
  },
  voteText: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  footer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  footerNote: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#16a34a',
    fontWeight: '500',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
};

```

---

### Core Mechanics

* **WebSocket Broadcast Architecture:** When any client submits a vote, the server increments the tally in memory and broadcasts the updated payload to all open connections simultaneously.
* **Derived Percentage Calculation:** Percentages are computed client-side using `useMemo` on every broadcast update without mutating the raw vote counters.
* **Client-Side Vote Locking:** `localStorage` stores the selected option ID to disable buttons and highlight the user's vote across tab refreshes.

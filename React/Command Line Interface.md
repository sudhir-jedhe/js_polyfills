*** copy Command Line Interface.md ***

A complete, interactive Command Line Interface (CLI) / Terminal component in React with command parsing, history scrolling ($\uparrow$/$\downarrow$), auto-focus, and custom output support.

### 1. Terminal Component (`Terminal.jsx`)

```jsx
import React, { useState, useRef, useEffect } from 'react';

const AVAILABLE_COMMANDS = {
  help: () => (
    <div>
      Available commands:
      <br />• <strong>help</strong> - Show all commands
      <br />• <strong>about</strong> - Overview of the developer
      <br />• <strong>skills</strong> - List tech stack
      <br />• <strong>clear</strong> - Clear the terminal output
      <br />• <strong>date</strong> - Display current date & time
    </div>
  ),
  about: () => 'Full-stack software engineer passionate about interactive UIs and React systems.',
  skills: () => 'JavaScript (ES6+), React, TypeScript, Node.js, Next.js, CSS/Tailwind',
  date: () => new Date().toLocaleString(),
};

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      command: '',
      output: 'Welcome to React CLI Terminal [Version 1.0.0]. Type "help" for a list of commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(null);

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll to the bottom when new logs appear
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on input when clicking inside terminal container
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Track command history for Up/Down arrow navigation
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(null);

    const [cmd, ...args] = trimmed.toLowerCase().split(' ');

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    let output;
    if (AVAILABLE_COMMANDS[cmd]) {
      output = AVAILABLE_COMMANDS[cmd](args);
    } else {
      output = `command not found: ${trimmed}. Type "help" for available commands.`;
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;

      const nextPointer =
        historyPointer === null
          ? commandHistory.length - 1
          : Math.max(0, historyPointer - 1);

      setHistoryPointer(nextPointer);
      setInputVal(commandHistory[nextPointer]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === null) return;

      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(null);
        setInputVal('');
      } else {
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      }
    }
  };

  return (
    <div style={styles.window} onClick={focusInput}>
      {/* Terminal Title Bar */}
      <div style={styles.titleBar}>
        <div style={styles.windowControls}>
          <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }} />
          <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }} />
          <span style={{ ...styles.dot, backgroundColor: '#27c93f' }} />
        </div>
        <span style={styles.windowTitle}>bash — 80x24</span>
      </div>

      {/* Terminal Body */}
      <div style={styles.body}>
        {history.map((item, index) => (
          <div key={index} style={styles.entry}>
            {item.command && (
              <div style={styles.promptLine}>
                <span style={styles.promptSymbol}>guest@react-terminal:~$</span>
                <span>{item.command}</span>
              </div>
            )}
            <div style={styles.output}>{item.output}</div>
          </div>
        ))}

        {/* Active Input Line */}
        <div style={styles.inputContainer}>
          <span style={styles.promptSymbol}>guest@react-terminal:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
            autoFocus
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}

const styles = {
  window: {
    maxWidth: '750px',
    width: '100%',
    margin: '30px auto',
    backgroundColor: '#0d1117',
    borderRadius: '10px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
    overflow: 'hidden',
    border: '1px solid #30363d',
    fontFamily: '"Fira Code", "Courier New", Courier, monospace',
    cursor: 'text',
  },
  titleBar: {
    backgroundColor: '#161b22',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderBottom: '1px solid #30363d',
    userSelect: 'none',
  },
  windowControls: {
    display: 'flex',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  windowTitle: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#8b949e',
    fontSize: '0.8rem',
  },
  body: {
    padding: '18px',
    minHeight: '320px',
    maxHeight: '480px',
    overflowY: 'auto',
    fontSize: '0.92rem',
    lineHeight: '1.5',
    color: '#c9d1d9',
  },
  entry: {
    marginBottom: '12px',
  },
  promptLine: {
    display: 'flex',
    gap: '8px',
    color: '#f0f6fc',
    fontWeight: '600',
  },
  promptSymbol: {
    color: '#58a6ff',
    userSelect: 'none',
  },
  output: {
    marginTop: '4px',
    color: '#8b949e',
    wordBreak: 'break-word',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f0f6fc',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
};

```

---

### Core Mechanics

* **Command Registry Dictionary:** `AVAILABLE_COMMANDS` maps text tokens directly to execution functions, making it trivial to add new commands without touching the rendering logic.
* **Shell History Navigation:** Pressing `ArrowUp` or `ArrowDown` navigates previous commands using the `historyPointer` index, mirroring standard Unix shell behavior.
* **Focus Trap:** Clicking anywhere inside the terminal window triggers `focusInput()` to bring keyboard focus right back to the `<input>`.
* **Smooth Auto-Scroll:** The `terminalEndRef` element paired with `scrollIntoView()` guarantees the user always sees the newest command output.

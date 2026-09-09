***  Build a Typewriter Effect .md ***

A self-contained Typewriter component in React that handles multi-word cycling, backspacing, customizable speeds, and a blinking cursor.

### 1. Typewriter Component (`Typewriter.jsx`)

```jsx
import React, { useState, useEffect } from 'react';

export default function Typewriter({
  words = ['Developer', 'Designer', 'Problem Solver'],
  typingSpeed = 120,
  deletingSpeed = 60,
  pauseTime = 1500,
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = words[currentWordIndex];

    const updateText = () => {
      if (!isDeleting) {
        // Typing forward
        setDisplayText(fullText.substring(0, displayText.length + 1));

        // When word is completely typed, pause then start deleting
        if (displayText === fullText) {
          setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      } else {
        // Backspacing
        setDisplayText(fullText.substring(0, displayText.length - 1));

        // When word is completely deleted, switch to next word
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
    };

    // Use deletingSpeed when erasing, typingSpeed when writing
    const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(updateText, currentSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span style={styles.container}>
      <span style={styles.text}>{displayText}</span>
      <span style={styles.cursor} aria-hidden="true">|</span>
    </span>
  );
}

const styles = {
  container: {
    fontFamily: 'monospace',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0070f3',
    display: 'inline-flex',
    alignItems: 'center',
  },
  text: {
    whiteSpace: 'pre',
  },
  cursor: {
    display: 'inline-block',
    marginLeft: '2px',
    animation: 'blink 1s step-end infinite',
    color: '#0070f3',
  },
};

```

---

### 2. Cursor Blink Animation (`index.css` or App CSS)

Add the keyframe animation to your global stylesheet to make the cursor blink:

```css
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

```

---

### 3. Usage Example (`App.jsx`)

```jsx
import React from 'react';
import Typewriter from './Typewriter';

export default function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>
        I am a{' '}
        <Typewriter
          words={['Full-Stack Engineer.', 'React Specialist.', 'UI/UX Enthusiast.']}
          typingSpeed={100}
          deletingSpeed={50}
          pauseTime={1200}
        />
      </h1>
    </div>
  );
}

```

---

### Core Mechanics

* **`substring()` Slicing:** Avoids string concatenation errors by indexing characters directly from `fullText` between `0` and `length ± 1`.
* **State Triad:** Tracks active word position (`currentWordIndex`), rendered string (`displayText`), and direction (`isDeleting`).
* **Clean Timer Lifecycle:** `clearTimeout(timer)` runs on every re-render to prevent race conditions or rapid speed glitches during component unmounts.

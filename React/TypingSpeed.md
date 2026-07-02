# Build a Typing Speed Test Component (React + TypeScript)

Features:

✅ 60-second timer  
✅ WPM (Words Per Minute) calculation  
✅ Accuracy calculation  
✅ Character highlighting (correct/incorrect/current)  
✅ Restart button  
✅ Auto-focus input  
✅ Clean architecture for interview discussions

***

## TypingSpeedTest.tsx

```tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TypingSpeedTest.css";

const SAMPLE_TEXT =
  "React is a JavaScript library for building fast and interactive user interfaces.";

const TEST_DURATION = 60;

export default function TypingSpeedTest() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isRunning || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isFinished]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isFinished) return;

    if (!isRunning) {
      setIsRunning(true);
    }

    setTypedText(event.target.value);
  };

  const correctCharacters = useMemo(() => {
    let count = 0;

    for (
      let i = 0;
      i < typedText.length;
      i++
    ) {
      if (typedText[i] === SAMPLE_TEXT[i]) {
        count++;
      }
    }

    return count;
  }, [typedText]);

  const accuracy = useMemo(() => {
    if (typedText.length === 0) return 100;

    return Math.round(
      (correctCharacters / typedText.length) *
        100
    );
  }, [typedText.length, correctCharacters]);

  const elapsedTime =
    TEST_DURATION - timeLeft;

  const wpm = useMemo(() => {
    if (elapsedTime === 0) return 0;

    const words = correctCharacters / 5;

    return Math.round(
      words / (elapsedTime / 60)
    );
  }, [correctCharacters, elapsedTime]);

  const restart = () => {
    setTypedText("");
    setTimeLeft(TEST_DURATION);
    setIsRunning(false);
    setIsFinished(false);

    inputRef.current?.focus();
  };

  return (
    <div className="typing-test">
      <h2>Typing Speed Test</h2>

      <div className="stats">
        <div>Time: {timeLeft}s</div>
        <div>WPM: {wpm}</div>
        <div>Accuracy: {accuracy}%</div>
      </div>

      <div className="sample-text">
        {SAMPLE_TEXT.split("").map(
          (char, index) => {
            let className = "";

            if (index < typedText.length) {
              className =
                typedText[index] === char
                  ? "correct"
                  : "incorrect";
            } else if (
              index === typedText.length
            ) {
              className = "current";
            }

            return (
              <span
                key={index}
                className={className}
              >
                {char}
              </span>
            );
          }
        )}
      </div>

      <input
        ref={inputRef}
        className="typing-input"
        value={typedText}
        onChange={handleChange}
        disabled={isFinished}
        placeholder="Start typing..."
      />

      {isFinished && (
        <div className="result">
          <h3>Test Complete!</h3>

          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>

          <button onClick={restart}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
```

***

## TypingSpeedTest.css

```css
.typing-test {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.sample-text {
  line-height: 2;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 20px;
}

.current {
  background: #fff3b0;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
  text-decoration: underline;
}

.typing-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
}

.result {
  margin-top: 20px;
}

button {
  padding: 10px 18px;
  cursor: pointer;
}
```

***

## App.tsx

```tsx
import TypingSpeedTest from "./TypingSpeedTest";

export default function App() {
  return <TypingSpeedTest />;
}
```

***

## Interview Enhancements

For a Senior Frontend interview, mention:

* Virtualised rendering for large text passages
* Multiple difficulty levels
* Real-time WPM graph
* Caret positioning
* Backspace tracking
* Mistake heatmap
* Leaderboard API
* LocalStorage persistence
* Custom Hook (`useTypingTest`)
* Context API / Zustand state management
* Analytics tracking
* Accessibility (`aria-live`, screen reader support)

### WPM Formula

```ts
WPM = Correct Characters / 5
      ---------------------
        Time In Minutes
```

### Accuracy Formula

```ts
Accuracy =
(correct characters /
 typed characters) * 100
```

This is a production-style foundation suitable for React machine coding and frontend interview rounds.

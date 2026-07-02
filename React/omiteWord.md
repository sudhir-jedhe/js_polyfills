You only need to implement the two TODOs.

### Solution

```jsx
import React, { useState } from "react";

const OMITTED_WORDS = ["a", "the", "and", "or", "but"];

function WordOmitter() {
  const [inputText, setInputText] = useState("");
  const [omitWords, setOmitWords] = useState(true);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const toggleOmitWords = () => {
    setOmitWords(!omitWords);
  };

  const clearFields = () => {
    setInputText("");
    setOmitWords(true);
  };

  const getProcessedText = () => {
    if (!omitWords) {
      return inputText;
    }

    return inputText
      .split(/\s+/)
      .filter(
        (word) =>
          !OMITTED_WORDS.includes(
            word.toLowerCase()
          )
      )
      .join(" ");
  };

  return (
    <div className="omitter-wrapper">
      <textarea
        placeholder="Type here..."
        value={inputText}
        onChange={handleInputChange}
        data-testid="input-area"
      />

      <div>
        <button
          onClick={toggleOmitWords}
          data-testid="action-btn"
        >
          {omitWords
            ? "Show All Words"
            : "Omit Words"}
        </button>

        <button
          onClick={clearFields}
          data-testid="clear-btn"
        >
          Clear
        </button>
      </div>

      <div>
        <h2>Output:</h2>

        <p data-testid="output-text">
          {getProcessedText()}
        </p>
      </div>
    </div>
  );
}

export { WordOmitter };
```

### Example

Input:

```text
the quick brown fox and the lazy dog
```

When `omitWords = true`:

```text
quick brown fox lazy dog
```

When `omitWords = false`:

```text
the quick brown fox and the lazy dog
```

### Time Complexity

```text
O(n)
```

where `n` is the number of words in the input.

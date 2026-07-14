# Queued Chat UI in React

### Similar to ChatGPT / Claude / Copilot

This is a very common **Senior React System Design** question because it tests knowledge of:

✅ Async message queueing

✅ Streaming responses

✅ State management

✅ Scroll behaviour

✅ UX polish

✅ Chat history

✅ Debouncing send

✅ Cancellation

✅ Retry mechanism

✅ Accessibility

---

# Requirements

## User Should Be Able To

✅ Type message

✅ Send message

✅ Send multiple messages without waiting

✅ AI response appears one after another

✅ Messages appear in **strict order**

✅ Loading indicator (streaming)

✅ Handle failure gracefully

✅ Auto-scroll to bottom

---

# Why "Queued"?

Users often send multiple messages fast:

```txt
Msg1
Msg2
Msg3
```

Without queueing:

```txt
API Call 1
API Call 2
API Call 3
```

executed simultaneously.

Bad because:

```txt
Race Conditions
Wrong order
Broken UI
```

With queueing:

```txt
Msg1 → wait response
Msg2 → wait response
Msg3 → wait response
```

Executed **sequentially**.

---

# System Design

```txt
User Input
     │
     ▼
Message Queue
     │
     ▼
Chat Engine
     │
     ▼
Async Processor
     │
     ▼
Streaming Response
     │
     ▼
Chat UI
```

---

# Component Architecture

```txt
App
│
├── ChatWindow
│    ├── MessageList
│    │    ├── UserMessage
│    │    └── BotMessage
│    │
│    └── ChatInput
│
└── useChatEngine (Hook)
     ├── Queue
     ├── Processor
     └── Streaming
```

---

# Project Structure

```txt
src/
│
├── App.jsx
│
├── chat/
│   ├── ChatWindow.jsx
│   ├── MessageList.jsx
│   ├── ChatInput.jsx
│   └── useChatEngine.js
│
└── styles.css
```

---

# 1. useChatEngine Hook

```jsx
import { useState, useRef, useCallback } from "react";

export function useChatEngine() {
  const [messages, setMessages] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);

  const queueRef = useRef([]);

  const processNext = useCallback(async () => {
    if (isProcessing || queueRef.current.length === 0) {
      return;
    }

    setIsProcessing(true);

    const message = queueRef.current.shift();

    // Add User Message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message.text,
        id: Date.now(),
      },
    ]);

    // Placeholder Bot Message
    const botId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        id: botId,
        streaming: true,
      },
    ]);

    try {
      await streamResponse(message.text, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? {
                  ...msg,
                  content: msg.content + chunk,
                }
              : msg,
          ),
        );
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botId
            ? {
                ...msg,
                content: "Error occurred. Please retry.",
              }
            : msg,
        ),
      );
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botId
            ? {
                ...msg,
                streaming: false,
              }
            : msg,
        ),
      );

      setIsProcessing(false);

      // Trigger next
      processNext();
    }
  }, [isProcessing]);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;

      queueRef.current.push({
        text,
      });

      processNext();
    },
    [processNext],
  );

  return {
    messages,
    sendMessage,
    isProcessing,
  };
}
```

---

# 2. Fake Streaming API

Simulates ChatGPT-like output.

```js
export async function streamResponse(message, onChunk) {
  const words = [
    "This",
    "is",
    "an",
    "AI",
    "response",
    "to",
    `"${message}"`,
    "generated",
    "in",
    "streaming",
    "mode.",
  ];

  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    onChunk(word + " ");
  }
}
```

---

# 3. ChatInput.jsx

```jsx
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend() {
    onSend(text);
    setText("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="input-row">
      <textarea
        value={text}
        placeholder="Type a message..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

# 4. MessageList.jsx

```jsx
import { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.role}`}>
          <p>
            {msg.content}

            {msg.streaming && <span className="cursor">▍</span>}
          </p>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
```

---

# 5. ChatWindow\.jsx

```jsx
import { useChatEngine } from "./useChatEngine";

import MessageList from "./MessageList";

import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { messages, sendMessage, isProcessing } = useChatEngine();

  return (
    <div className="chat-window">
      <MessageList messages={messages} />

      <ChatInput onSend={sendMessage} />

      {isProcessing && <div className="status">AI is typing...</div>}
    </div>
  );
}
```

---

# 6. App.jsx

```jsx
import ChatWindow from "./chat/ChatWindow";
import "./styles.css";

export default function App() {
  return <ChatWindow />;
}
```

---

# 7. styles.css

```css
body {
  font-family: Arial;
  background: #f4f6f8;
}

.chat-window {
  width: 700px;
  margin: 30px auto;

  background: white;
  border-radius: 10px;
  padding: 16px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
}

.messages {
  height: 500px;
  overflow-y: auto;

  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 80%;
}

.user {
  background: #dbeafe;
  align-self: flex-end;
}

.assistant {
  background: #f3f4f6;
  align-self: flex-start;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.input-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

textarea {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: none;
}

button {
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

---

# How It Works

## Step 1

User types message.

## Step 2

Message is added to queue.

## Step 3

Engine picks message.

## Step 4

User message appears.

## Step 5

Bot placeholder appears.

## Step 6

Response streams token by token.

## Step 7

Once finished, next message from queue is processed.

## Step 8

If empty, queue becomes idle.

---

# Async Queue Diagram

```txt
User
  ↓
Msg1
  ↓
Queue → [Msg1, Msg2, Msg3]
  ↓
Engine picks Msg1
  ↓
Stream response
  ↓
Complete
  ↓
Engine picks Msg2
  ↓
...
```

---

# Interview Follow-Up Questions

### Why queue messages?

To maintain **response ordering**.

Without queueing:

```txt
Msg1 sent
Msg2 sent
Msg3 sent
```

Responses may arrive out of order.

---

### Why streaming?

Faster perceived response time.

Like ChatGPT.

---

### How to cancel?

Add AbortController:

```js
const controller = new AbortController();
```

Cancel:

```js
controller.abort();
```

---

### How to persist chat history?

```js
localStorage.setItem("history", JSON.stringify(messages));
```

---

### Real Backend Integration

```txt
WebSocket
SSE (Server Sent Events)
Fetch stream API
```

---

# Extensions

✅ Retry Message

✅ Multi-turn context memory

✅ Threaded conversations

✅ Copy button

✅ Markdown rendering

✅ Voice input

✅ Attachments

✅ Cancel button while streaming

---

# Senior React Interview Answer

> I would design a queued chat UI using a message queue managed inside a custom hook. When a user sends a message, it's pushed to a queue and processed sequentially by an async engine. Each user message triggers a placeholder assistant message which streams content chunk by chunk, similar to ChatGPT. The queue ensures response order is preserved even if the user sends multiple messages quickly. Additional production features include AbortController for cancellation, retry logic, streaming from WebSocket or SSE, chat persistence with localStorage, auto-scroll to the latest message, markdown rendering, and accessibility support. This design is scalable and closely resembles how modern AI assistants like ChatGPT, Claude, and Copilot handle real-time conversations.

These are the **three most common Senior React interview follow-ups** after implementing a queued chat UI.

They align exactly with what apps like **ChatGPT, Claude, and Copilot** do.

---

# 1. Retry & Cancel Support

## Why Cancel?

User types:

```txt
Explain quantum physics in 500 words
```

AI starts streaming...

User clicks:

```txt
Stop
```

or

```txt
Cancel
```

We should stop the stream immediately.

---

## Why Retry?

If server fails:

```txt
Network error
Timeout
API failure
```

We should show:

```txt
Retry
```

button.

---

## Approach

Use:

```txt
AbortController
```

---

## Update useChatEngine

```jsx
const abortRef = useRef(null);
```

---

## Cancel Function

```jsx
const cancelStreaming = useCallback(() => {
  abortRef.current?.abort();
}, []);
```

---

## Retry Function

```jsx
const retryMessage = useCallback(
  (messageText) => {
    sendMessage(messageText);
  },
  [sendMessage],
);
```

---

## Modify Streaming Function

```jsx
export async function streamResponse(message, onChunk, signal) {
  const words = message.split(" ");

  for (const word of words) {
    if (signal?.aborted) {
      throw new DOMException("Cancelled", "AbortError");
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    onChunk(word + " ");
  }
}
```

---

## Use Inside Engine

```jsx
try {
  const controller = new AbortController();

  abortRef.current = controller;

  await streamResponse(
    message.text,
    (chunk) => {
      updateBotMessage(chunk);
    },
    controller.signal,
  );
} catch (error) {
  if (error.name === "AbortError") {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === botId
          ? {
              ...msg,
              content: msg.content + "\n\n(cancelled)",
            }
          : msg,
      ),
    );
  } else {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === botId
          ? {
              ...msg,
              content: "Error occurred.",
              failed: true,
              userMessage: message.text,
            }
          : msg,
      ),
    );
  }
}
```

---

## Cancel Button

```jsx
{
  isProcessing && <button onClick={cancelStreaming}>Stop</button>;
}
```

---

## Retry Button

```jsx
{
  msg.failed && (
    <button onClick={() => retryMessage(msg.userMessage)}>Retry</button>
  );
}
```

---

## User Experience

```txt
User: Explain React state

AI: React state is used to...

[Stop]

--- Cancel ---

AI: React state is used to (cancelled)

[Retry]
```

---

# 2. Persist Chat History in LocalStorage

Chat should survive:

```txt
Page Refresh
Tab Close
Browser Restart
```

---

## Load On Mount

```jsx
const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("chat-history");

  return saved ? JSON.parse(saved) : [];
});
```

---

## Save On Change

```jsx
useEffect(() => {
  localStorage.setItem("chat-history", JSON.stringify(messages));
}, [messages]);
```

---

## Clear History Button

```jsx
function clearChat() {
  setMessages([]);

  localStorage.removeItem("chat-history");
}
```

---

## UX Flow

```txt
Chat Loads
     │
     ▼
Load From LocalStorage
     │
     ▼
Restore Full Conversation
```

---

## Improvements

### Handle Storage Errors

```jsx
try {
  localStorage.setItem("chat-history", JSON.stringify(messages));
} catch (error) {
  console.warn("LocalStorage full");
}
```

---

### Store Metadata

```js
{
  version: 1,
  updatedAt: Date.now(),
  messages: []
}
```

Useful when schema changes.

---

# 3. Markdown Rendering

ChatGPT/Claude responses include:

✅ Bold

✅ Italics

✅ Lists

✅ Code Blocks

✅ Tables

✅ Links

Must render markdown safely.

---

## Install

```bash
npm install react-markdown remark-gfm
```

---

## Import

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
```

---

## Replace Message Text

Currently:

```jsx
<p>{msg.content}</p>
```

Update to:

```jsx
<ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
```

---

## Now Supports

Bold:

```txt
**Sudhir**
```

Result:

```txt
Sudhir
```

---

Bullet List:

```txt
- React
- Node
- MongoDB
```

Result:

```txt
• React
• Node
• MongoDB
```

---

Code Block:

````txt
```js
const x = 10;
````

````

Result:

```js
const x = 10;
````

---

Table:

```txt
| Name    | Age |
|---------|-----|
| Sudhir  | 30  |
```

---

## Custom Code Block Styling

```jsx
<ReactMarkdown
  components={{
    code({ node, inline, className, children }) {
      const language = className?.replace("language-", "");

      return inline ? (
        <code className="inline">{children}</code>
      ) : (
        <pre className="block">
          <code className={language}>{children}</code>
        </pre>
      );
    },
  }}
>
  {msg.content}
</ReactMarkdown>
```

---

## Add Syntax Highlighting

Use:

```bash
npm install react-syntax-highlighter
```

Then wrap `code` in:

```jsx
<SyntaxHighlighter language={language} style={atomDark}>
  {String(children)}
</SyntaxHighlighter>
```

---

# Full Chat UI Now Supports

```txt
✅ Queueing
✅ Streaming
✅ Cancel
✅ Retry
✅ Persistence
✅ Markdown
✅ Code Highlighting
```

---

# Interview-Level Architecture

```txt
              Chat Queue
                 │
                 ▼
           Chat Engine
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼

  Stream      Cancel       Retry

     ▼
Markdown Rendering
     ▼
Auto Scroll
     ▼
LocalStorage
     ▼
Chat UI
```

---

# Senior React Interview Answer

> To make the chat UI production-grade, I integrate three key features. First, I add **cancellation** using `AbortController`, allowing the user to stop long streams gracefully. Second, I add **retry**, so if a message fails due to network or API issues, the user can regenerate it with a single click. Third, I add **persistence** using `localStorage`, hydrating messages on mount and saving them on every update to survive page refresh. Finally, I add **markdown rendering** using `react-markdown` with GFM support for tables, lists, headings, and code blocks, along with syntax highlighting to match modern AI assistant UIs like ChatGPT, Claude, and Copilot.

# Custom Markdown Code Block Styling in React

### With Syntax Highlighting + Copy Button (ChatGPT/Claude Style)

Users expect:

✅ Syntax highlighted code

✅ Language label (js, ts, python)

✅ Copy button

✅ Dark theme

✅ Inline code differently styled

✅ Word wrap for long lines

---

# 1. Install Dependencies

```bash
npm install react-markdown remark-gfm react-syntax-highlighter
```

---

# 2. Chat Message Component

```jsx
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useState } from "react";
```

---

# 3. Custom CodeBlock Component

```jsx
function CodeBlock({ inline, className, children }) {
  const [copied, setCopied] = useState(false);

  const language = className
    ? className.replace("language-", "")
    : "javascript";

  const code = String(children).replace(/\n$/, "");

  function handleCopy() {
    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (inline) {
    return <code className="inline-code">{children}</code>;
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language-tag">{language}</span>

        <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
```

---

# 4. Markdown Renderer

```jsx
export default function ChatMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

---

# 5. Example Usage

```jsx
const message = `
Here is a React example:

\`\`\`jsx
function Hello() {
  return <h1>Hello World</h1>;
}
\`\`\`

Inline example: use \`useState\` for local state.

\`\`\`js
const total = a + b;
console.log(total);
\`\`\`
`;

<ChatMessage content={message} />;
```

---

# 6. Styling (CSS)

```css
.code-block {
  background: #1e1e1e;
  border-radius: 8px;
  margin: 12px 0;
  overflow: hidden;
  border: 1px solid #2d2d2d;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #111;
  color: #eee;

  padding: 6px 12px;
  font-size: 12px;
  font-family: monospace;
}

.language-tag {
  text-transform: uppercase;
  color: #a5d6ff;
}

.code-header button {
  background: transparent;
  color: #eee;
  border: 1px solid #444;

  padding: 4px 8px;
  border-radius: 4px;

  cursor: pointer;
  font-size: 12px;
}

.code-header button:hover {
  background: #333;
}

.inline-code {
  background: rgba(59, 130, 246, 0.15);

  color: #2563eb;

  padding: 2px 6px;
  border-radius: 4px;

  font-family: monospace;
  font-size: 90%;
}
```

---

# 7. Visual Result

Header:

```txt
JSX          [ Copy ]

function Hello() {
  return <h1>Hello World</h1>;
}
```

Copy click:

```txt
JSX          [ Copied! ]
```

Inline code:

```txt
Use `useState` for local state.
```

---

# 8. Improvements

### Handle Empty Language

```jsx
const language = className ? className.replace("language-", "") : "text";
```

---

### Long Lines

Enable:

```jsx
wrapLongLines;
```

---

### Theme Options

```txt
oneDark
dracula
atomDark
vsDark
```

Example:

```jsx
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
```

---

### Add Icon (Optional)

```jsx
import { Copy, CheckCircle } from "lucide-react";
```

Button:

```jsx
{
  copied ? <CheckCircle /> : <Copy />;
}
```

---

# 9. Enterprise Additions

✅ Streaming markdown from server (SSE / WebSocket)

✅ LaTeX using `remark-math` + `rehype-katex`

✅ Rendered links open in new tab

✅ Markdown tables with sticky headers

✅ Copy-per-block

✅ Auto-detect language

✅ Custom themes (light/dark)

---

# Senior React Interview Answer

> ChatGPT-style code blocks are implemented by overriding the `code` component in `react-markdown`. Inline code renders as a styled span, while block-level code uses `react-syntax-highlighter` for language-based highlighting. The block includes a header with the detected language and a Copy button that uses the Clipboard API. This design mimics AI assistant UIs like ChatGPT, Claude, and Copilot, providing a clean developer experience with syntax colouring, copy support, wrapped lines, and consistent theming.

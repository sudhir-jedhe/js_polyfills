**`useOptimistic`** in React 19 lets you update the UI immediately with an assumed successful result while an asynchronous **Action** is in flight.

If the action succeeds, the actual resolved state replaces the optimistic value. If the action fails or throws, React automatically rolls the optimistic UI back to the true base state without manual rollback boilerplate.

---

### Core Data Flow

```
[ User Submits Form ] 
         │
         ├── 1. `setOptimistic(newValue)` ──► UI updates instantly (0ms latency)
         │
         └── 2. Async Action executes in background
                   │
                   ├── Success ──► Base state updates; replaces optimistic value
                   └── Error   ──► React discards optimistic value; rolls back to base state

```

---

### Complete Implementation Example: Optimistic Chat Message

#### 1. Server/Async Action (`actions.js`)

```javascript
// Simulates an async message creation API with potential delay/failure
export async function sendMessageAction(previousMessages, formData) {
  const messageText = formData.get('message');

  const response = await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ text: messageText }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to deliver message.');
  }

  const savedMessage = await response.json();
  // Return the new persistent base state
  return [...previousMessages, savedMessage];
}

```

---

#### 2. Component with `useOptimistic` & `useActionState`

```jsx
import { useActionState, useOptimistic, useRef } from 'react';
import { sendMessageAction } from './actions';

export function ChatRoom({ initialMessages = [] }) {
  const formRef = useRef(null);

  // 1. Base state managed by useActionState
  const [messages, formAction, isPending] = useActionState(
    sendMessageAction,
    initialMessages
  );

  // 2. Optimistic state hook
  // useOptimistic(passthroughState, updateFn)
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (currentMessages, newMessageText) => [
      ...currentMessages,
      {
        id: `temp-${Date.now()}`,
        text: newMessageText,
        sending: true, // Flag to show a pending visual state
      },
    ]
  );

  // 3. Wrapper action to trigger optimistic update before async work begins
  const handleSubmit = async (formData) => {
    const text = formData.get('message');
    if (!text || !text.trim()) return;

    // Reset the input field immediately
    formRef.current?.reset();

    // Trigger instant optimistic update
    setOptimisticMessages(text);

    // Run the actual background action
    await formAction(formData);
  };

  return (
    <div className="chat-container">
      <ul className="message-list">
        {optimisticMessages.map((msg) => (
          <li
            key={msg.id}
            style={{
              opacity: msg.sending ? 0.6 : 1,
              fontStyle: msg.sending ? 'italic' : 'normal',
            }}
          >
            {msg.text}
            {msg.sending && <span className="status-pill"> (Sending...)</span>}
          </li>
        ))}
      </ul>

      <form ref={formRef} action={handleSubmit} className="chat-input-row">
        <input
          name="message"
          type="text"
          placeholder="Type a message..."
          required
        />
        <button type="submit" disabled={isPending}>
          Send
        </button>
      </form>
    </div>
  );
}

```

---

### How `useOptimistic` Works Under the Hood

1. **Invocation:** `useOptimistic(baseState, updateFn)` takes two arguments:

* **`baseState`:** The actual source of truth (from props, `useActionState`, or a cache).
* **`updateFn(currentState, optimisticValue)`:** A pure reducer function that calculates how the optimistic state should look by merging `optimisticValue` with `currentState`.

1. **Lifecycle during Transitions:**

* When `setOptimisticMessages(value)` is called inside an Action/Transition, React immediately re-renders the component with the return value of `updateFn`.
* While the action Promise is unresolved, any reads from `optimisticMessages` reflect this merged transient state.

1. **Automatic Reconciliation / Rollback:**

* **On Success:** Once the action finishes, the base state updates. React re-renders using the new `baseState` and clears the temporary optimistic layer.
* **On Failure:** If the action throws or rejects, React catches the error (via Error Boundary or try/catch), ignores the transient update, and renders the untouched `baseState`.

---

### Key Patterns & Best Practices

* **Always Keep Updates Pure:** The second argument to `useOptimistic` must be a pure reducer function without side effects or mutations.
* **Add a "Pending" Marker:** Include a flag (like `sending: true` or `isOptimistic: true`) in your optimistic data shape. This lets you style the item differently (e.g., lower opacity, clock icon) so the user knows delivery is in progress.
* **Must Be Used Within a Transition / Action:** Calling the setter from `useOptimistic` outside of an Action or `startTransition` will throw a runtime warning, as React needs a transition boundary to manage the lifecycle of the temporary value.

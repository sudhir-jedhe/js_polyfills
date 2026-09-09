***  03-undo-redo-text-input.md ***

# Problem: Implement an Undo/Redo Manager for a Text Input

## Problem Statement

Implement an undo/redo-capable text input using a history array kept in `useState` — every distinct edit should be undoable and redoable, and typing after an undo should discard any "future" redo history, matching standard undo/redo semantics (like a text editor).

## Requirements

- A single `useState` holds `{ history: string[], pointer: number }` — `history[pointer]` is the currently displayed value.
- Typing commits a new history entry at `pointer + 1` and **truncates** any entries after that point (the classic "typing after undo clears redo" behavior).
- `undo()` moves `pointer` back one step (no-op if already at the start).
- `redo()` moves `pointer` forward one step (no-op if already at the end, i.e. nothing to redo).
- All updates must be immutable (new array/object each time, never mutating `history` in place).

## Approach

Model the whole undo/redo state as a single object so `history` and `pointer` always update together atomically via one `setState` call — updating them as two separate `useState` calls would risk them getting out of sync across renders. Typing doesn't append blindly; it slices `history` down to `pointer + 1` first (discarding any redo-able future) and then appends the new value, which is exactly what makes "type after undo" correctly wipe the redo stack instead of leaving stale future entries around.

## Solution

```jsx
function useUndoableState(initialValue) {
  const [state, setState] = React.useState({ history: [initialValue], pointer: 0 });

  const value = state.history[state.pointer];

  function set(newValue) {
    setState(prev => {
      // Drop any "future" (redo) entries beyond the current pointer before appending.
      const truncated = prev.history.slice(0, prev.pointer + 1);
      return {
        history: [...truncated, newValue],
        pointer: truncated.length, // points at the newly appended entry
      };
    });
  }

  function undo() {
    setState(prev => ({
      ...prev,
      pointer: Math.max(0, prev.pointer - 1), // no-op past the start
    }));
  }

  function redo() {
    setState(prev => ({
      ...prev,
      pointer: Math.min(prev.history.length - 1, prev.pointer + 1), // no-op past the end
    }));
  }

  const canUndo = state.pointer > 0;
  const canRedo = state.pointer < state.history.length - 1;

  return { value, set, undo, redo, canUndo, canRedo };
}

// --- usage ---
function UndoableTextInput() {
  const { value, set, undo, redo, canUndo, canRedo } = useUndoableState('');

  return (
    <div>
      <input value={value} onChange={e => set(e.target.value)} />
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}

// --- verification (simulated calls against the hook's returned handlers) ---
// Conceptually walking through state.history / state.pointer at each step:
// set('h')    -> history: ['', 'h'],        pointer: 1   (value: 'h')
// set('he')   -> history: ['', 'h', 'he'],   pointer: 2   (value: 'he')
// set('hel')  -> history: ['', 'h', 'he', 'hel'], pointer: 3 (value: 'hel')
// undo()      -> pointer: 2                                (value: 'he')
// undo()      -> pointer: 1                                (value: 'h')
// set('hi')   -> history: ['', 'h', 'hi'],   pointer: 2   (value: 'hi')
//                ^ 'he' and 'hel' were discarded — typing after undo clears redo history
// redo()      -> pointer stays at 2 (no-op, already at the end, nothing to redo)
```

**Why this works:** Storing `history` and `pointer` in one state object guarantees they're always read and written together — there's no intermediate render where `pointer` could point past the end of a `history` that hasn't been updated yet, which is a real risk if they were two separate `useState` calls updated by two separate setter calls in the same handler. Slicing to `prev.pointer + 1` before appending on every `set()` call is what correctly implements "new edits discard the redo stack," rather than naively pushing onto the end of the full array and leaving orphaned future entries that `redo()` could incorrectly resurrect.

**Extension points:** debouncing `set()` (e.g. only committing a new history entry after a pause in typing, rather than on every keystroke) would make the undo granularity feel more like a real text editor's "undo a word" rather than "undo a keystroke" — that's a straightforward addition layered on top of this same history/pointer model, not a change to the model itself.

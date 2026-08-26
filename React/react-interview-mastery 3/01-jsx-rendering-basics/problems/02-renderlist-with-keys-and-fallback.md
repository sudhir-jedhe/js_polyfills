*** copy 02-renderlist-with-keys-and-fallback.md ***

# Problem: Implement `renderList(items, renderItem)`

## Problem Statement

Implement a `renderList(items, renderItem, options)` helper that maps an array of items into an array of React elements, correctly assigning a stable `key` to each one, and rendering a fallback UI when the list is empty instead of silently rendering nothing.

## Requirements

- `renderList(items, renderItem)` returns an array of elements produced by calling `renderItem(item, index)` for each item.
- Each returned element must have a `key`. Prefer a stable id on the item (`item.id`) if present; fall back to index only when no id is available, and warn in the console when falling back (so misuse is visible during development, mirroring how React's own missing-key warning works).
- If `items` is empty (or not an array), render a configurable empty-state fallback instead of an empty `<>` — accept an `emptyFallback` element/function via `options`.
- Must be usable directly inside JSX: `<ul>{renderList(todos, todo => <li>{todo.text}</li>)}</ul>`.

## Approach

`renderList` is a thin, reusable wrapper around `.map()` plus a length check. The key part is key derivation: check for `item?.id` (or a custom `getKey` from `options`) first, and only fall back to the array index with a development-time warning, since index keys are correct only for lists that never reorder/insert/delete (see the reconciliation theory file for why). The empty-state branch runs before mapping, so a `renderItem` function never needs to special-case an empty array itself.

## Solution

```jsx
// renderList: maps items to keyed elements, with a configurable empty-state fallback.
function renderList(items, renderItem, options = {}) {
  const { getKey, emptyFallback = null } = options;

  if (!Array.isArray(items) || items.length === 0) {
    return typeof emptyFallback === 'function' ? emptyFallback() : emptyFallback;
  }

  return items.map((item, index) => {
    let key;
    if (typeof getKey === 'function') {
      key = getKey(item, index);
    } else if (item && typeof item === 'object' && item.id !== undefined) {
      key = item.id;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'renderList: falling back to index as key — pass options.getKey or ensure items have a stable `id` for lists that can reorder/filter.'
        );
      }
      key = index;
    }

    const element = renderItem(item, index);
    // Clone so the key ends up on the actual returned element, regardless of
    // whether renderItem already set one (ours wins, since we computed it deliberately).
    return React.cloneElement(element, { key });
  });
}

// --- usage ---
function TodoList({ todos }) {
  return (
    <ul>
      {renderList(todos, (todo) => <li>{todo.text}</li>, {
        emptyFallback: <li className="empty">No todos yet — add one above.</li>,
      })}
    </ul>
  );
}

// --- verification (conceptual, since this needs a DOM/JSX runtime to actually render) ---
const withIds = [{ id: 'a', text: 'Buy milk' }, { id: 'b', text: 'Walk dog' }];
console.log(renderList(withIds, (t) => <li>{t.text}</li>).length); // 2 elements, keyed 'a' and 'b'
console.log(renderList([], (t) => <li>{t.text}</li>, { emptyFallback: <li>Empty</li> }));
// returns the <li>Empty</li> element instead of an empty array
```

**Why this works:** Centralizing key derivation in one helper means every list in the app gets the same "prefer stable id, warn on index fallback" policy instead of each call site silently defaulting to `key={index}` out of habit. Handling the empty case inside the helper (rather than in every call site) removes a whole class of "forgot the empty state" bugs and keeps `renderItem` focused purely on rendering a single item.

**Known limitation:** `React.cloneElement` to force the key works but assumes `renderItem` always returns a single element (not a fragment-wrapping multiple nodes, and not a string/number/`null`); a production version would need to handle those cases explicitly, likely by wrapping non-element returns in a keyed `<React.Fragment>`.

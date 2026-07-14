```js

const items = [1, 2, 3];
console.log(items); // [1, 2, 3]

const reversedItems = items.toReversed();
console.log(reversedItems); // [3, 2, 1]
console.log(items); // [1, 2, 3]

console.log([1, , 3].toReversed()); // [3, undefined, 1]
console.log([1, , 3, 4].toReversed()); // [4, 3, undefined, 1]


const arrayLike = {
  length: 3,
  unrelated: "foo",
  2: 4,
};
console.log(Array.prototype.toReversed.call(arrayLike));
// [4, undefined, undefined]
// The '0' and '1' indices are not present so they become undefined

```


### `Array.prototype.toReversed()`

`toReversed()` is a modern JavaScript array method introduced in ES2023.

Unlike `reverse()`, it **does not modify the original array**.

***

## `reverse()` (Mutates)

```javascript
const arr = [1, 2, 3];

const reversed = arr.reverse();

console.log(reversed);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[3, 2, 1]
```

⚠️ Original array changed.

***

## `toReversed()` (Immutable)

```javascript
const arr = [1, 2, 3];

const reversed =
  arr.toReversed();

console.log(reversed);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[1, 2, 3]
```

✅ Original array remains unchanged.

***

# Equivalent Polyfill

```javascript
Array.prototype.customToReversed =
  function () {
    return [...this].reverse();
  };
```

### Usage

```javascript
const arr = [1, 2, 3];

const result =
  arr.customToReversed();

console.log(result);
console.log(arr);
```

### Output

```javascript
[3, 2, 1]

[1, 2, 3]
```

***

# Manual Polyfill (Interview Question)

```javascript
Array.prototype.customToReversed =
  function () {
    const result = [];

    for (
      let i = this.length - 1;
      i >= 0;
      i--
    ) {
      result.push(this[i]);
    }

    return result;
  };
```

***

# With Objects

```javascript
const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
];

const reversed =
  users.toReversed();

console.log(reversed);
console.log(users);
```

Output:

```javascript
[
  { id: 3 },
  { id: 2 },
  { id: 1 }
]

[
  { id: 1 },
  { id: 2 },
  { id: 3 }
]
```

***

# React Example

### ❌ Avoid

```javascript
setUsers(
  users.reverse()
);
```

Mutates state.

***

### ✅ Use

```javascript
setUsers(
  users.toReversed()
);
```

or

```javascript
setUsers(
  [...users].reverse()
);
```

***

# Interview Comparison

| Method         | Mutates Original | Returns New Array |
| -------------- | ---------------- | ----------------- |
| `reverse()`    | ✅                | ❌                 |
| `toReversed()` | ❌                | ✅                 |

***

# Related ES2023 Immutable Methods

### `toSorted()`

```javascript
const arr = [3, 1, 2];

const sorted =
  arr.toSorted();

console.log(sorted);
```

Output:

```javascript
[1, 2, 3]
```

***

### `toSpliced()`

```javascript
const arr = [1, 2, 3];

const result =
  arr.toSpliced(1, 1);
```

Output:

```javascript
[1, 3]
```

***

### `with()`

```javascript
const arr = [1, 2, 3];

const result =
  arr.with(1, 100);

console.log(result);
```

Output:

```javascript
[1, 100, 3]
```

***

### Interview One-Liner

> `toReversed()` is the immutable version of `reverse()`. It returns a new reversed array without modifying the original array, making it especially useful in React and functional programming where immutability is important.
# 1. `toReversed()` with Strings

`toReversed()` works on arrays, not directly on strings.

### Reverse Characters in a String

```javascript
const str = "Sudhir";

const reversed =
  [...str].toReversed().join("");

console.log(reversed);
```

### Output

```javascript
"rihduS"
```

***

### Reverse Words in a Sentence

```javascript
const sentence =
  "React JavaScript TypeScript";

const result = sentence
  .split(" ")
  .toReversed()
  .join(" ");

console.log(result);
```

### Output

```javascript
"TypeScript JavaScript React"
```

***

# 2. `toReversed()` with Objects

## Array of Objects

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  },
  {
    id: 3,
    name: "Mike"
  }
];

const reversed =
  users.toReversed();

console.log(reversed);
```

### Output

```javascript
[
  { id: 3, name: "Mike" },
  { id: 2, name: "John" },
  { id: 1, name: "Sudhir" }
]
```

Original array remains:

```javascript
[
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
]
```

***

# 3. Compare `toReversed()`, `toSorted()`, and `toSpliced()`

These are the new **immutable array methods**.

***

## `toReversed()`

Returns a reversed copy.

```javascript
const arr = [1, 2, 3];

const result =
  arr.toReversed();

console.log(result);
```

Output:

```javascript
[3, 2, 1]
```

Original:

```javascript
[1, 2, 3]
```

***

## `toSorted()`

Returns a sorted copy.

```javascript
const arr = [3, 1, 2];

const result =
  arr.toSorted();

console.log(result);
```

Output:

```javascript
[1, 2, 3]
```

Original:

```javascript
[3, 1, 2]
```

***

### Objects Example

```javascript
const users = [
  { name: "John", age: 35 },
  { name: "Sudhir", age: 30 }
];

const sorted =
  users.toSorted(
    (a, b) => a.age - b.age
  );

console.log(sorted);
```

***

## `toSpliced()`

Immutable version of `splice()`.

```javascript
const arr = [1, 2, 3, 4];

const result =
  arr.toSpliced(
    1,
    2
  );

console.log(result);
```

Output:

```javascript
[1, 4]
```

Original:

```javascript
[1, 2, 3, 4]
```

***

## Comparison Table

| Method         | Purpose          | Mutates Original |
| -------------- | ---------------- | ---------------- |
| `reverse()`    | Reverse array    | ✅                |
| `toReversed()` | Reverse copy     | ❌                |
| `sort()`       | Sort array       | ✅                |
| `toSorted()`   | Sort copy        | ❌                |
| `splice()`     | Add/remove items | ✅                |
| `toSpliced()`  | Add/remove copy  | ❌                |

***

# 4. React Example Using `toReversed()`

## Reverse List Order

```jsx
import { useState } from "react";

export default function App() {
  const [users, setUsers] =
    useState([
      "Sudhir",
      "John",
      "Mike"
    ]);

  const reverseOrder = () => {
    setUsers(prev =>
      prev.toReversed()
    );
  };

  return (
    <>
      <button onClick={reverseOrder}>
        Reverse
      </button>

      <ul>
        {users.map(user => (
          <li key={user}>
            {user}
          </li>
        ))}
      </ul>
    </>
  );
}
```

***

### Initial UI

```text
Sudhir
John
Mike
```

***

### After Click

```text
Mike
John
Sudhir
```

***

# React Example with Chat Messages

A common pattern:

```jsx
const [messages, setMessages] =
  useState(data);

const showLatestFirst = () => {
  setMessages(prev =>
    prev.toReversed()
  );
};
```

Useful for:

* Chat applications
* Activity feeds
* Notifications
* Transaction history

***

# React Example with useMemo

```jsx
const latestUsers = useMemo(
  () => users.toReversed(),
  [users]
);
```

This avoids recalculating the reversed array on every render.

***

## Interview Answer

> `toReversed()`, `toSorted()`, and `toSpliced()` are ES2023 immutable array methods. Unlike `reverse()`, `sort()`, and `splice()`, they return a new array without mutating the original. They are particularly useful in React applications because they align with React's immutable state update patterns and prevent accidental state mutations.

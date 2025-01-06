### Task Overview

We need to create a `counter` function that behaves differently based on the context:

1. **Counter Object with Methods**: A counter object should be created that can be incremented or decremented with specific methods, and the current value should be retrievable.
2. **Counter with a Closure**: Another version uses closures to keep the state of the counter private.
3. **Counter with Read-Only Property**: A version that increments a counter each time it's accessed, but does not allow direct modification of the counter.
4. **Counter with Increment and Reset**: A counter that increments and resets, based on given instructions.

### 1. **Counter Object with Methods**:
This creates a counter object with methods to increment, decrement, and get the value.

```javascript
function Counter() {
  let count = 0;

  return {
    get() {
      return count;
    },
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
  };
}

// Example usage:
const counter = Counter();

console.log(counter.get()); // 0
counter.increment();
console.log(counter.get()); // 1
counter.decrement();
console.log(counter.get()); // 0
```

### 2. **Counter with Closure**:
This version creates a closure where the counter's state is private, and the `modify` function handles incrementing or decrementing the count.

```javascript
function counter() {
  let count = 0;

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function modify(val) {
    if (val === "1") increment();
    else if (val === "0") decrement();
    return count;
  }

  return modify;
}

const closure = counter();
console.log(closure("1")); // Increment and returns 1
console.log(closure("0")); // Decrement and returns 0
```

### 3. **Counter with Read-Only Property**:
This version returns an object where the `count` property increments automatically each time it's accessed. The value can't be modified directly.

```javascript
function createCounter() {
  let count = 0;

  return {
    get count() {
      return count++;
    }
  };
}

// Example usage:
const counter = createCounter();
console.log(counter.count); // 0
console.log(counter.count); // 1
console.log(counter.count); // 2
counter.count = 100; // This won't change the value
console.log(counter.count); // 3
```

### 4. **Counter with Increment, Decrement, and Reset**:
This version allows incrementing, decrementing, and resetting the counter to its initial value.

```javascript
var createCounter = function(init) {
  let cnt = init;
  return {
    increment: () => cnt += 1,
    decrement: () => cnt -= 1,
    reset: () => cnt = init,
    get: () => cnt
  };
};

// Example usage:
const counter = createCounter(5);
console.log(counter.get()); // 5
console.log(counter.increment()); // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4
```

### Summary of Solutions:

- **Counter Object**: Use methods like `get`, `increment`, and `decrement` to control the count.
- **Counter with Closure**: A closure maintains the counter's state privately, and external functions interact with it.
- **Counter with Read-Only Property**: The `count` property increments automatically on each access.
- **Counter with Increment, Decrement, and Reset**: This implementation includes all three actions — `increment`, `decrement`, and `reset`.

These are all valid approaches depending on how you want the counter to behave and whether you need to maintain encapsulation, control access, or expose the counter directly.
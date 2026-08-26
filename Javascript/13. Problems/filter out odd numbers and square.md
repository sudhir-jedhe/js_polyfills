*** copy filter out odd numbers and square.md ***

Here are the standard ways to filter out odd numbers and square them in JavaScript:

### Method 1: Chaining `filter()` and `map()` (Most Readable)

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const result = numbers
  .filter((num) => num % 2 !== 0) // Keep only odd numbers
  .map((num) => num ** 2);        // Square each remaining number

console.log(result); 
// Output: [1, 9, 25, 49, 81]

```

---

### Method 2: Single Pass with `reduce()` (Best Performance)

Iterates over the array only once instead of creating an intermediate array:

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const result = numbers.reduce((acc, num) => {
  if (num % 2 !== 0) {
    acc.push(num ** 2);
  }
  return acc;
}, []);

console.log(result); 
// Output: [1, 9, 25, 49, 81]

```

---

### Method 3: `flatMap()`

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const result = numbers.flatMap((num) => (num % 2 !== 0 ? [num ** 2] : []));

console.log(result); 
// Output: [1, 9, 25, 49, 81]

```

*(Note: `num % 2 !== 0` correctly handles negative odd numbers like `-3`, whereas `num % 2 === 1` fails for negative values).*

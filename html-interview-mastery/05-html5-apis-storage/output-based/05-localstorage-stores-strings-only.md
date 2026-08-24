# Output: Storing a Number and an Object in localStorage

```js
localStorage.setItem('count', 5);
localStorage.setItem('config', { theme: 'dark' });

console.log(typeof localStorage.getItem('count'));
console.log(localStorage.getItem('count') + 1);
console.log(localStorage.getItem('config'));
```

**Question:** What gets logged for each line?

**Answer:**
```
string
"51"
[object Object]
```

**Why:** `localStorage` (and `sessionStorage`) only stores **strings**. `setItem` coerces any non-string value via `String()`/`.toString()` before storing it — the number `5` becomes the string `"5"`, and the plain object `{ theme: 'dark' }` becomes the string `"[object Object]"` (its actual key/value data is lost entirely, not serialized). So `getItem('count')` returns the string `"5"`, `typeof` on it is `"string"`, and `"5" + 1` performs string concatenation, producing `"51"`, not the number `6`. Retrieving structured data correctly requires `JSON.stringify` on write and `JSON.parse` on read — storing a raw object directly, as this snippet does, silently corrupts the data with no error thrown.

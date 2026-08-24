# Snippet: Offloading a Heavy Computation to a Web Worker

```js
// main.js
const worker = new Worker('fib-worker.js');

document.getElementById('calc').addEventListener('click', () => {
  worker.postMessage(40); // compute the 40th Fibonacci number
  document.getElementById('result').textContent = 'Calculating…';
});

worker.onmessage = (e) => {
  document.getElementById('result').textContent = `Result: ${e.data}`;
};
```

```js
// fib-worker.js
function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

self.onmessage = (e) => {
  const n = e.data;
  const result = fib(n); // expensive — runs on the worker thread, not the main thread
  self.postMessage(result);
};
```

```html
<button id="calc">Calculate fib(40)</button>
<p id="result"></p>
```

Clicking the button keeps the page fully responsive (scrolling, other clicks) while `fib(40)` grinds away on the worker thread — running the same recursive call directly on the main thread would freeze the UI for the duration of the computation.

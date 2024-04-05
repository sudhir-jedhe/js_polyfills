```js

function* filter(collection, predicate) {
  for (const value of collection) {
    if (predicate(value)) {
      yield value;
    }
  }
}

module.exports = filter;

```
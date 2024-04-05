```js
function filter(array, func) {
  return reduce(
    array,
    function (result, item) {
      if (func(item)) {
        result.push(item);
        return result;
      }
      return result;
    },
    []
  );
}
filter([1, 2, 3, 4, 5], (item) => item >= 3); // [ 3, 4, 5 ]

```


```js
const filter = (array, func) =>
  reduce(
    array,
    (result, item) => (func(item) ? result.concat(item) : result),
    []
  );

```
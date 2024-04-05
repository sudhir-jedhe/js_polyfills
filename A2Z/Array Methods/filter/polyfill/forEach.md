```js

const reduce = (array, cb, initialValue) => {
  let result = initialValue;
  array.forEach((item) => (result = cb.call(undefined, result, item, array)));
  return result;
};

```
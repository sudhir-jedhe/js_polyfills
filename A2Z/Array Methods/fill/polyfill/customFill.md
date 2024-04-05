```js
Array.prototype.customFill = function (filledValue,
  start = 0,
  end = this.length
) {
  for (let i = start; i < end; i++) {
    this[i] = filledValue;
  }
  return this;
}
```

```js
//declaring array with given values
var Given_values = [1, 2, 3, 4, 5];

console.log(`Given values array ${Given_values}`);

//creating an array filled with given values
var filledArray = Array(2).fill(Given_values);

//printing output array
console.log(`Array filled with given values is [${filledArray}]`);
```
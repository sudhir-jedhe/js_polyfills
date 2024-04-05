

```js

//declaring array with Given values
var Given_values = [1, 2, 3, 4, 5];

console.log("Given values array " + Given_values);

//creating an array filled with Given_values array
var filledArray = Array.from({ length: 1 }, () => Given_values);

//printing output
console.log("Array filled with given values [ " + filledArray + " ]");

```
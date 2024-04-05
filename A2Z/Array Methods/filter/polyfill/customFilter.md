```js

Array.prototype.customFilter = function(callback) {
  var newArray = [];
  for (var i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      newArray.push(this[i]);
    }
  }
  return newArray;
};

var numbers = [1, 2, 3, 4, 5];
var evenNumbers = numbers.customFilter(function(number) {
  return number % 2 === 0;
});

console.log(evenNumbers); // [2, 4]
```
```javascript
Array.prototype.customMap = function(callback) {
    const newArray = [];
    for (let i = 0; i < this.length; i++) {
      newArray.push(callback(this[i]));
    }
    return newArray;
  };
  
  const numbers = [1, 2, 3, 4, 5];
  const squaredNumbers = numbers.customMap((number) => number * number);
  
  console.log(squaredNumbers); // [1, 4, 9, 16, 25]
  ```


```javascript
Array.prototype.customMap = function(callback, thisArg) {
    var mapArray = [];
    for (let i = 0; i < this.length; i++) {
        let current = this[i];
        mapArray.push(callback.call(thisArg, current, i, this));
    }
    return mapArray;
};

const result = arr.customMap((elem) => {
    return 3 * elem;
  });
console.log(result);
```
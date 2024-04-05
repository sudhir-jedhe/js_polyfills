```js

var givenValues = [1, 2, 3, 4, 5];
console.log("Given elements:" + givenValues); //create an array filled with   given values
var filledArray = Array.apply(null, Array(1)).map((_, i) => givenValues);
//printing output array console.log('Array filled with given   values [ '+filledArray+' ]');


```
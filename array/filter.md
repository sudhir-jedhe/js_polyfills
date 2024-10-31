
  filter() creates a new array with each element in the original
  array if and only if the element pass the supplied predicate callback.

  The predicate callback is invoked with three arguments:

  - the value of the element
  - the index of the element
  - the Array object being traversed

  The predicate callback is expected to return true if the element should
  appear in the new array, otherwise false.

  You can optionally specify a value to use as `this` in the callback
  as the second argument to filter().

  If no elements pass the predicate callback, an empty array will be returned


```javascript
Array.prototype.customFilter = function myFilter(callback, thisArg) {
  const newArray = [];
  for (let i = 0; i < this.length; i += 1) {
    if (callback.call(thisArg, this[i], i, this)) {
      newArray.push(this[i]);
    }
  }
  return newArray;
};
```


```javascript
function* filter(collection, predicate) {
  for (const value of collection) {
    if (predicate(value)) {
      yield value;
    }
  }
}

module.exports = filter;
```



```javascript
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


```javascript
const filter = (array, func) =>
  reduce(
    array,
    (result, item) => (func(item) ? result.concat(item) : result),
    []
  );

```

```javascript
const reduce = (array, cb, initialValue) => {
  let result = initialValue;
  array.forEach((item) => (result = cb.call(undefined, result, item, array)));
  return result;
};

```

```javascript
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(removeDuplicates(arr));
```

```javascript
let nums = [4, -5, 3, 2, -1, 7, -6, 8, 9];

let pos_nums = nums.filter((e) => e > 0);
console.log(pos_nums);

```

```javascript
function isInRange(val) {
  return val >= this.lower && val <= this.upper;
}

let range = {
  lower: 1,
  upper: 10,
};

let data = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let res = data.filter(isInRange, range);
console.log(res);
```


```javascript
function isNumber(value) {
  if (typeof value === "number") {
    return true;
  }
}

let data = [10, null, "30", 1.4, "falcon", undefined, true, 17];

let res = data.filter(isNumber);
console.log(res);
```

```javascript
const users = [
  { name: "John", city: "London", born: "2001-04-01" },
  { name: "Lenny", city: "New York", born: "1997-12-11" },
  { name: "Andrew", city: "Boston", born: "1987-02-22" },
  { name: "Peter", city: "Prague", born: "1936-03-24" },
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Adam", city: "Trnava", born: "1983-12-01" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" },
  { name: "Robert", city: "Prague", born: "1998-03-14" },
];

let res = users.filter((user) => user.city === "Bratislava");
console.log(res);

let res = users.filter(
  (user) => user.city === "Bratislava" && user.name.startsWith("A")
);
console.log(res);

function getAge(dt) {
  return moment.duration(moment() - moment(dt, "YYYY-MM-DD", true)).years();
}

let res = users.filter((user) => getAge(user.born) > 40);

console.log(res);
```


Find a single value
If you are looking for a single result in an array, you can use Array.prototype.find() instead. This will return the first element that satisfies the condition, or undefined if no such element exists. It's much faster than Array.prototype.filter(), as it will stop iterating as soon as it finds the first matching element.

```javascript
const arr = [1, 2, 3, 4, 5];

arr.find(x => x > 3); // 4
```
Additionally, if the condition is a simple equality check, you can also use Array.prototype.indexOf(). While not as pretty as the other two, it can be significantly faster, as there's no overhead from using a comparator function.
```javascript

const arr = [1, 2, 3, 4, 5];

arr.indexOf(3); // 2
```
Remove a single value
Similarly, if you want to remove a single value from an array, you can use Array.prototype.findIndex() to find the index of the element you want to remove. Then, use Array.prototype.slice() to remove it. While this is a little more verbose and seems to perform more operations, it can actually be faster than using Array.prototype.filter() in many cases.

```javascript
const arr = [1, 2, 3, 4, 5];

const index = arr.findIndex(x => x === 3);
const newArr = [...arr.slice(0, index), ...arr.slice(index + 1)];
```
// [1, 2, 4, 5]
Similarly, if you don't mind mutating the original array, you can use Array.prototype.splice() to remove the element at the index you found. As this method doesn't have to create a new array, it can be significantly faster than the previous one.

```javascript
const arr = [1, 2, 3, 4, 5];

const index = arr.findIndex(x => x === 3);
arr.splice(index, 1); // [1, 2, 4, 5]
```
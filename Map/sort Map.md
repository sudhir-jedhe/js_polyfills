A map is a data structure that is used to store the key-value pair.

As the map entries are in pairs to sort them either on key or the value we will have to convert it to an array and then perform the sorting on it.

JavaScript array has an inbuilt sort method available that we can use for sorting.

**Sorting the Javascript map on keys in ascending order**
The Array.sort() method sorts the value depending upon the return value of the callback, If the value is positive it will sort in ascending order, if it is negative it will sort in descending order, if it zero then it will do nothing.

By default if the callback function is not passed to the sort method, it will sort in ascending order.

To sort the value, we will convert the map to an array using the spread operator ... and then sort it.

```javascript
const map1 = new Map();
map1.set(3, "three");
map1.set(2, "two");
map1.set(1, "one");

const sorted = [...map1].sort();
const map2 = new Map(sorted);
console.log([...map2]);

[
[1,"one"], // [object Array] (2)
[2,"two"], // [object Array] (2)
[3,"three"] // [object Array] (2)
]

```
The map maintains the order of the insertion and the key can be any data type that JavaScript supports like string, number, object, etc. We have set the numeric keys with string values.

Then spread the object in an array and sort it and after that added the sorted array to the new map so that the key order can be maintained.


**Sorting the map with the string keys in ascending order**
Even if the keys are string we can use the same technique to sort them. Here in the map, we have string keys and numeric values, and the keys are sorted with locale comparison.



```javascript
const map1 = new Map();
map1.set("three", 1);
map1.set("two", 2);
map1.set("one", 1);

const sorted = [...map1].sort();
const map2 = new Map(sorted);
console.log([...map2]);

[
["one",1],// [object Array] (2)
["three",1],// [object Array] (2)
["two",2]// [object Array] (2)
]
```
**Sorting the Javascript map on keys in descending order**

To sort the keys in descending order, we will have to return the negative value in the sort callback function, thus we will do the reverse comparison, that is compare the next value with the current.




```javascript
const map1 = new Map();
map1.set(3, "three");
map1.set(2, "two");
map1.set(1, "one");

// sort in descending order.
const sorted = [...map1].sort((a, b) => b[0] - a[0]);

const map2 = new Map(sorted);

console.log([...map2]);

[
[3,"three"], // [object Array] (2)
[2,"two"], // [object Array] (2)
[1,"one"] // [object Array] (2)
]
```


```javascript
const map1 = new Map();
map1.set(3, "three");
map1.set(2, "two");
map1.set(1, "one");

// reverse sorted array.
const sorted = [...map1].sort().reverse();

const map2 = new Map(sorted);

console.log([...map2]);

[
[3,"three"], // [object Array] (2)
[2,"two"], // [object Array] (2)
[1,"one"] // [object Array] (2)
]
```

```javascript

const map1 = new Map();
map1.set("three", 3);
map1.set("two", 2);
map1.set("one", 1);

// sort in descending order.
const sorted = [...map1].sort((a, b) => b[0].localeCompare(a[0]));

const map2 = new Map(sorted);

console.log([...map2]);

[
["two",2], // [object Array] (2)
["three",3], // [object Array] (2)
["one",1] // [object Array] (2)
]
```
**Sorting the JavaScript map on the values in ascending order**
When the map is spread in the array we receive an array of the key-value pair with the key on the 0th index and the value on the 1st index.

Thus to sort the values, we will use the first index value in the sort method of the array.

```javascript
const map1 = new Map();
map1.set("three", 3);
map1.set("two", 2);
map1.set("one", 1);

// sort in ascending order.
const sorted = [...map1].sort((a, b) => a[1] - b[1]);

const map2 = new Map(sorted);

console.log([...map2]);

[
["one",1],// [object Array] (2)
["two",2],// [object Array] (2)
["three",3] // [object Array] (2)
]

```
**Sorting the JavaScript map on the values in descending order**

To sort the map on the values in descending order, either we can reverse the order of the ascending order or update the sort function itself to sort in descending.

const map1 = new Map();
map1.set("two", 2);
map1.set("three", 3);
map1.set("one", 1);

// sort in descending order.
const sorted = [...map1].sort((a, b) => b[1] - a[1]);

const map2 = new Map(sorted);

console.log([...map2]);

[
["three",3],// [object Array] (2)
["two",2],// [object Array] (2)
["one",1]// [object Array] (2)
]
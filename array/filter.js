/**
 *
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
*/

Array.prototype.customFilter = function myFilter(callback, thisArg) {
  const newArray = [];
  for (let i = 0; i < this.length; i += 1) {
    if (callback.call(thisArg, this[i], i, this)) {
      newArray.push(this[i]);
    }
  }
  return newArray;
};

/************************************************************ */
function* filter(collection, predicate) {
  for (const value of collection) {
    if (predicate(value)) {
      yield value;
    }
  }
}

module.exports = filter;

/****************************************************** */

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

/**************************************************************** */
const filter = (array, func) =>
  reduce(
    array,
    (result, item) => (func(item) ? result.concat(item) : result),
    []
  );

/**************************************************************** */
const reduce = (array, cb, initialValue) => {
  let result = initialValue;
  array.forEach((item) => (result = cb.call(undefined, result, item, array)));
  return result;
};

/******************************************* */
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(removeDuplicates(arr));

/********************************************** */
let nums = [4, -5, 3, 2, -1, 7, -6, 8, 9];

let pos_nums = nums.filter((e) => e > 0);
console.log(pos_nums);

/****************************************** */

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

/*********************************** */
function isNumber(value) {
  if (typeof value === "number") {
    return true;
  }
}

let data = [10, null, "30", 1.4, "falcon", undefined, true, 17];

let res = data.filter(isNumber);
console.log(res);
/************************************************** */
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

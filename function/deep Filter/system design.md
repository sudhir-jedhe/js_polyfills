n this question, you must implement a function that takes two arguments object and filter function, then returns a filtered object.

Syntax
filter(collection, callback);
Arguments
collection (Object): The collection to iterate over
callback (Function) => (Boolean): The function invoked over every element
Return
Object: Returns the filtered object
Examples
const input = {
  a: 1,
  b: {
    c: 2,
    d: -3,
    e: {
      f: {
        g: -4,
      },
    },
    h: {
      i: 5,
      j: 6,
    },
  }
};

const callback = element => element >= 0;

function filter(input, callback) {
  // filtering logic here
}

const filtered = filter(input, callback);

// { a: 1, b: { c: 2, h: { i: 5, j: 6 } } }
console.log(filtered);
const input = {
  a: 1,
  b: {
    c: 'Hello World',
    d: 2,
    e: {
      f: {
        g: -4,
      },
    },
    h: 'Good Night Moon',
  },
}

const callback = element => typeof element === "string";

function filter(input, callback) {
  // filtering logic here
}

const filtered = filter(input, callback);

// { b: { c: 'Hello World', h: 'Good Night Moon' } } 
console.log(filtered);
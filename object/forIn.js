function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  for (let key in exampleObj) {
    if (exampleObj.hasOwnProperty(key)) {
      value = exampleObj[key];
      console.log(key, value);
    }
  }
}
iterateObject();



/*************************** */
//break out loop

const smallArray = [0, 2];
const largeArray = Array.from({ length: 1000 }, (_, i) => i);

const areEqual = (a, b) => {
  for (let i in a) {
    if (b[i] === undefined || a[i] !== b[i]) return false;
  }
  return true;
}

areEqual(largeArray, smallArray); // false
// Will only loop until the first mismatch is encountered

/************************* */

// for...in is used to iterate over all enumerable properties of an object, including inherited enumerable properties. This iteration statement can be used with arrays strings or plain objects, but not with Map or Set objects.

for (let prop in ['a', 'b', 'c'])
  console.log(prop);            // 0, 1, 2 (array indexes)

for (let prop in 'str')
  console.log(prop);            // 0, 1, 2 (string indexes)

for (let prop in {a: 1, b: 2, c: 3})
  console.log(prop);            // a, b, c (object property names)

for (let prop in new Set(['a', 'b', 'a', 'd']))
  console.log(prop);            // undefined (no enumerable properties)

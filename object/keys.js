function isObject(object) {
  return object && typeof object === "object";
}

function keys(object) {
  return isObject(object) ? Object.keys(object) : [];
}

module.exports = keys;

/*********************************/
function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  Object.keys(exampleObj).forEach((key) => {
    const value = exampleObj[key];
    console.log(`${key}: ${value}`);
  });
}
iterateObject();

/************************************ */
console.log(Reflect.ownKeys([]));
console.log(Reflect.ownKeys([,]));
console.log(Reflect.ownKeys([1, , 2]));
console.log(Reflect.ownKeys([...[1, , 2]]));



How Object.keys Works in JavaScript

Have you ever wondered how Object.keys decides the order of keys? While objects in JavaScript are technically unordered, Object.keys applies some rules when creating the array of keys.

Take a look at the attached example,

Here’s what happens behind the scenes:

 1. A new array is created: When you call Object.keys, it creates a new array to hold the keys.

 2. Integer keys are sorted: Keys that are numbers (like 1, 2, 55) are added first, and they’re sorted in ascending order.

 3. String keys are added next: Keys that are strings ("ball", "apple", "cat") are added in the same order they were inserted into the object.

 4. Symbols come last: If there are any symbol keys, they’re added after the string keys (though they don’t appear in Object.keys, they show up in Object.getOwnPropertySymbols).

Understanding this can help you avoid surprises when working with objects, especially if your keys are a mix of numbers, strings, and symbols.
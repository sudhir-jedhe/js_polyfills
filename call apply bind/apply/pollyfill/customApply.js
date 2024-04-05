function myApply(func, thisArg, argsArray) {
  // Check if the function is callable.
  if (typeof func !== "function") {
    throw new TypeError("func must be a function");
  }

  // Check if the thisArg is an object.
  if (thisArg !== null && typeof thisArg !== "object") {
    throw new TypeError("thisArg must be an object or null");
  }

  // Check if the argsArray is an array.
  if (!Array.isArray(argsArray)) {
    throw new TypeError("argsArray must be an array");
  }

  // Call the function with the given thisArg and argsArray.
  return func.apply(thisArg, argsArray);
}

const result = myApply(Math.max, null, [1, 2, 3]);

console.log(result); // 3

const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

const result = myApply(person.fullName, person, []);

console.log(result); // John Doe

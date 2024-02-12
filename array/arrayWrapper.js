// create an ArrayWrapper class that accepts an array of integers in its constructor. The class should have the following features:

// When two instances of this class are added together with the + operator, the resulting value is the sum of all the elements in both arrays.
// When the String() function is called on the instance, it will return a comma-separated string surrounded by brackets. For example, [1,2,3].

class ArrayWrapper {
  constructor(array) {
    this.array = array;
  }

  // Overload the addition operator
  static [Symbol.toPrimitive](other) {
    if (other === "number") {
      return this.array.reduce((acc, curr) => acc + curr, 0);
    }
    if (other === "string") {
      return `[${this.array.join(",")}]`;
    }
  }

  // Overload the string conversion
  valueOf() {
    return this.array.reduce((acc, curr) => acc + curr, 0);
  }

  // Overload the string conversion
  toString() {
    return `[${this.array.join(",")}]`;
  }
}

// Usage
const arr1 = new ArrayWrapper([1, 2, 3]);
const arr2 = new ArrayWrapper([4, 5, 6]);

const sum = arr1 + arr2;
console.log(sum); // Output: 21

const stringRepresentation = String(arr1);
console.log(stringRepresentation); // Output: [1,2,3]

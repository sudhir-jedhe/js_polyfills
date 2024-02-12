let mySet = new Set(); // Creating an empty set

// Creating a set with initial values
let mySetWithValues = new Set([1, 2, 3, 4, 5]);

mySet.add(1);
mySet.add(2);
mySet.add(3);

if (mySet.has(3)) {
  console.log("3 is present in the Set.");
} else {
  console.log("3 is not present in the Set.");
}

mySet.delete(2); // Removes the value 2 from the Set

mySet.forEach(function (value) {
  console.log(value);
});

// Using for...of loop
for (let value of mySet) {
  console.log(value);
}

console.log(mySet.size); // Prints the number of elements in the Set

class CustomSet {
  constructor() {
    this.items = {};
  }

  add(value) {
    if (!this.has(value)) {
      this.items[value] = value;
      return true;
    }
    return false;
  }

  delete(value) {
    if (this.has(value)) {
      delete this.items[value];
      return true;
    }
    return false;
  }

  has(value) {
    return this.items.hasOwnProperty(value);
  }

  clear() {
    this.items = {};
  }

  size() {
    return Object.keys(this.items).length;
  }

  values() {
    return Object.values(this.items);
  }

  // Union operation with another set
  union(otherSet) {
    let unionSet = new CustomSet();
    this.values().forEach((value) => unionSet.add(value));
    otherSet.values().forEach((value) => unionSet.add(value));
    return unionSet;
  }

  // Intersection operation with another set
  intersection(otherSet) {
    let intersectionSet = new CustomSet();
    this.values().forEach((value) => {
      if (otherSet.has(value)) {
        intersectionSet.add(value);
      }
    });
    return intersectionSet;
  }

  // Difference operation with another set
  difference(otherSet) {
    let differenceSet = new CustomSet();
    this.values().forEach((value) => {
      if (!otherSet.has(value)) {
        differenceSet.add(value);
      }
    });
    return differenceSet;
  }

  // Subset operation
  isSubsetOf(otherSet) {
    return this.values().every((value) => otherSet.has(value));
  }
}

// Example usage:
let set1 = new CustomSet();
set1.add(1);
set1.add(2);
set1.add(3);

let set2 = new CustomSet();
set2.add(3);
set2.add(4);
set2.add(5);

console.log("Set 1:", set1.values());
console.log("Set 2:", set2.values());

console.log("Union:", set1.union(set2).values());
console.log("Intersection:", set1.intersection(set2).values());
console.log("Difference (Set 1 - Set 2):", set1.difference(set2).values());
console.log("Is Set 1 a subset of Set 2?", set1.isSubsetOf(set2));

function setToArray(set) {
  return Array.from(set);
}

// Example usage:
let mySet = new Set([1, 2, 3, 4, 5]);
let arrayFromSet = setToArray(mySet);
console.log(arrayFromSet); // Output: [1, 2, 3, 4, 5]

function unionSets(set1, set2) {
  let unionSet = new Set();

  // Add elements from the first set to the union set
  set1.forEach((value) => {
    unionSet.add(value);
  });

  // Add elements from the second set to the union set
  set2.forEach((value) => {
    unionSet.add(value);
  });

  return unionSet;
}

// Example usage:
let set1 = new Set([1, 2, 3]);
let set2 = new Set([3, 4, 5]);
let union = unionSets(set1, set2);
console.log(union); // Output: Set(5) { 1, 2, 3, 4, 5 }

function intersectionSets(set1, set2) {
  let intersectionSet = new Set();

  // Iterate over elements of set1
  set1.forEach((value) => {
    // Check if the element is also present in set2
    if (set2.has(value)) {
      intersectionSet.add(value);
    }
  });

  return intersectionSet;
}

// Example usage:
let set1 = new Set([1, 2, 3]);
let set2 = new Set([2, 3, 4]);
let intersection = intersectionSets(set1, set2);
console.log(intersection); // Output: Set(2) { 2, 3 }

function addToSet(set, array) {
  array.forEach((element) => {
    if (!set.has(element)) {
      set.add(element);
    }
  });

  return set;
}

// Example usage:
let mySet = new Set([1, 2, 3]);
let myArray = [3, 4, 5];
let modifiedSet = addToSet(mySet, myArray);
console.log(modifiedSet); // Output: Set(5) { 1, 2, 3, 4, 5 }

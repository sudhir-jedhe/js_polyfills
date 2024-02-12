// sortPeople.js
export function sortPeople(names, heights) {
  const sorted = names
    .map((name, index) => ({ name, height: heights[index] }))
    .sort((a, b) => b.height - a.height)
    .map((person) => person.name);
  return sorted;
}

// main.js
import { sortPeople } from "./sortPeople.js";

const names = ["John", "Alice", "Bob"];
const heights = [180, 160, 170];
console.log(sortPeople(names, heights)); // Output: ['John', 'Bob', 'Alice']

/****************** */

// sortPeople.js
export function sortPeople(names, heights) {
  const sortedIndices = heights
    .map((_, index) => index)
    .sort((a, b) => heights[b] - heights[a]);
  return sortedIndices.map((index) => names[index]);
}

// main.js
import { sortPeople } from "./sortPeople.js";

const names = ["Alice", "Bob", "Charlie"];
const heights = [175, 180, 170];

const sortedNames = sortPeople(names, heights);
console.log(sortedNames); // Output: ["Bob", "Alice", "Charlie"]

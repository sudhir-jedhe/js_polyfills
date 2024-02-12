export function countMatches(items, ruleKey, ruleValue) {
  let count = 0;

  for (const item of items) {
    const [type, color, name] = item;

    if (
      (ruleKey === "type" && type === ruleValue) ||
      (ruleKey === "color" && color === ruleValue) ||
      (ruleKey === "name" && name === ruleValue)
    ) {
      count++;
    }
  }

  return count;
}

import { countMatches } from "./countMatches.js";

const items = [
  ["phone", "blue", "pixel"],
  ["computer", "silver", "lenovo"],
  ["phone", "gold", "iphone"],
];
const ruleKey = "color";
const ruleValue = "silver";
console.log(countMatches(items, ruleKey, ruleValue)); // Output: 1

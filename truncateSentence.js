// truncateSentence.js
export function truncateSentence(s, k) {
  const words = s.split(" ");
  return words.slice(0, k).join(" ");
}

// main.js
import { truncateSentence } from "./truncateSentence.js";

const s = "Hello how are you doing today";
const k = 3;

console.log(truncateSentence(s, k)); // Output: "Hello how are"

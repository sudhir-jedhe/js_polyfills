// As we have discussed earlier, if the array has a thousands-of-levels nesting,
// a recursive approach might cause a stack overflow.
//  We can utilize generators to yield array item individually.
// As generators are lazy in nature, this wouldn't have as big of an upfront
// cost as our recursive approach does.

/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function* flatten(value: Array<any>): Array<any> {
  for (const item of value) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}


/**************************** */
// Bonus Solution 1: Regex and JSON.stringify
// Here is a solution that might be considered unorthodox: we first encode the array into a JSON string via JSON.stringify, and filter out brackets using regex /(\[|\])/g, and we decode it back to an array using JSON.parse. Because all the brackets are stripped off with the regex, we end up with an array with only one level of depth.

type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  return JSON.parse('[' + JSON.stringify(value).replace(/(\[|\])/g, '') + ']');
}
// Bonus Solution 2: toString when the array contains only numbers
// Recall that we asked about the data types as one of the clarification questions? If the array contains only numbers, here is a very simple solution:

function flattenOnlyNumbers(array) {
  return array
    .toString()
    .split(',')
    .map((numStr) => Number(numStr));
}
// Note that this only applies when the array only contains numbers, and this usage of toString might be thought of as "obscure".


/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten(value) {
  return value.reduce(
    (acc, curr) => acc.concat(Array.isArray(curr) ? flatten(curr) : curr),
    []
  );
}





/*********************************** */

// The flatMap function method returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level. By calling it recursively, we can flatten the entire array until it is only one level deep.



type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  return Array.isArray(value) ? value.flatMap((item) => flatten(item)) : value;
}
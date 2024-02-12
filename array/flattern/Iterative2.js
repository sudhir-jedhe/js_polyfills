// Solution 2: Iterative Solution with Array.prototype.some
// A more concise approach, compared to the previous one, is to use Array.prototype.some.

type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  while (value.some(Array.isArray)) {
    value = [].concat(...value);
  }

  return value;
}

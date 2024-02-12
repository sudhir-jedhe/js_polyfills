// Solution 4: Flatten the array in-place
// All the solutions we have seen so far are returning a new flattened array without mutating the original input array. Again, this is normally what you want.

// However, the interviewer might ask you to implement an in-place solution that doesn't allocate extra memory. That is, a solution with a constant O(1) space complexity.

// In this case, you will need to leverage array methods that mutate. There are 9 methods in total that mutate arrays: pop, push, reverse, shift, sort, splice, unshift, copyWithin and fill.

// Here is one possible solution that uses splice to mutate the input array:

type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  for (let i = 0; i < value.length; ) {
    if (Array.isArray(value[i])) {
      value.splice(i, 1, ...value[i]);
    } else {
      i++;
    }
  }

  return value;
}

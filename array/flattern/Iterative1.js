// First let's think through how we should check if a given value is an array or not.
// We can use Array.isArray or instanceof Array to achieve that.
//  There are some nuances between these two. If you are interested you can check out this article by Jake Archibald.

// Then, we don't want to mutate the original input array, which is a good practice in general, so we will make a copy of the input array and return a new array with all the items extracted from the input array.

// Here is the solution. We loop through the array with a while loop and we take out an item from the array one at a time to check to see if that item is an array. If the item is not an array, we put it into the res array. If it is an array, we use a spread operator ...
// to get all the items out of it and put them back to the array.

type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  const res = [];
  const copy = value.slice();

  while (copy.length) {
    const item = copy.shift();
    if (Array.isArray(item)) {
      copy.unshift(...item);
    } else {
      res.push(item);
    }
  }

  return res;
}

let nested_array = [
  [1, 2],
  [3, 4],
  [
    [5, [10, 12], 6],
    [7, 8, 9],
  ],
  [10, 11, 12, 13, 14, 15],
];

/*************************** Array For Flat  method ***************************/

const recursive_flattened_array = (array) => {
  const resultArr = [];
  const recursive = (arr) => {
    let count = 0;
    while (count < arr.length) {
      const current = arr[count];
      if (Array.isArray(current)) {
        recursive(current);
      } else {
        resultArr.push(current);
      }
      count++;
    }
  };
  recursive(array);
  return resultArr;
};

console.log("Flattened Array: ", recursive_flattened_array(nested_array));

const stackFlatArr = (arr) => {
  const stack = [...arr];
  console.log(stack);
  const flattened_array = [];
  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      stack.push(...current);
    } else {
      flattened_array.push(current);
    }
  }
  return flattened_array.reverse();
};
console.log(stackFlatArr(nested_array));

function flattenArray(arr) {
  return arr.reduce((flat, current) => {
    if (Array.isArray(current)) {
      return flat.concat(flattenArray(current));
    } else {
      return flat.concat(current);
    }
  }, []);
}

const nestedArray = [1, [2, [3, 4, [5, 6]]], 7, [8]];

const flatArray = flattenArray(nestedArray);

console.log(flatArray);
// Output: [1, 2, 3, 4, 5, 6, 7, 8]

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



type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  return JSON.parse('[' + JSON.stringify(value).replace(/(\[|\])/g, '') + ']');
}



function flattenOnlyNumbers(array) {
  return array
    .toString()
    .split(',')
    .map((numStr) => Number(numStr));
}

export default function flatten(arr) {
  return arr.flat(Infinity);
}



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


type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  while (value.some(Array.isArray)) {
    value = [].concat(...value);
  }

  return value;
}


/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten(value) {
  return value.reduce(
    (acc, curr) => acc.concat(Array.isArray(curr) ? flatten(curr) : curr),
    [],
  );
}



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


type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  return Array.isArray(value) ? value.flatMap((item) => flatten(item)) : value;
}




/******************************* */

async function getValueList(fromIndex, toIndex) {
  // Input JSON structure
  const input = [
      { "value": "value0", "children": [] },
      { "value": "value1", "children": [
          { "value": "value2", "children": [
              { "value": "value3", "children": [] }
          ]},
          { "value": "value4", "children": [] }
      ]},
      { "value": "value5", "children": [] },
      { "value": "value6", "children": [] }
  ];

  // Function to flatten the input structure
  const flatten = (arr) => {
      let result = [];
      arr.forEach(item => {
          result.push(item.value); // Add the current value
          if (item.children.length > 0) {
              result = result.concat(flatten(item.children)); // Recursively flatten children
          }
      });
      return result;
  };

  // Flatten the input
  const flatValues = flatten(input);

  // Return the sliced array based on the indices
  return flatValues.slice(fromIndex, toIndex);
}

// Example usage (uncomment to test)
// (async () => {
//     console.log(await getValueList(0, 3)); // Output: ['value0', 'value1', 'value2']
//     console.log(await getValueList(2, 5)); // Output: ['value2', 'value3', 'value4']
// })();

// Do not edit below this line
export default getValueList;

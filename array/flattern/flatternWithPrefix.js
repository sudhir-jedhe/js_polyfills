function flattenWithPrefix(arr, prefix = '') {
    const flatten = (arr, prefix) => {
        return arr.reduce((acc, item) => {
            const value = prefix + item.value;
            acc.push(value);
            if (item.children.length > 0) {
                acc = acc.concat(flatten(item.children, value + '_'));
            }
            return acc;
        }, []);
    };

    return flatten(arr, prefix);
}

// Example usage:
const input = [
  {
    "value": "value0",
    "children": []
  },
  {
    "value": "value1",
    "children": [
      {
        "value": "value2",
        "children": [
          {
            "value": "value3",
            "children": []
          }
        ]
      },
      {
        "value": "value4",
        "children": []
      }
    ]
  },
  {
    "value": "value5",
    "children": []
  }, {
    "value": "value6",
    "children": []
  }
];

console.log(flattenWithPrefix(input, 'prefix_'));



/*************************** */
function flattenWithPrefix(obj, prefix = '') {
    const result = {};

    const flatten = (obj, prefix) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const newKey = prefix + key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flatten(obj[key], newKey + '_');
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
    };

    flatten(obj, prefix);
    return result;
}

// Example usage:
const input = {
    "key1": "value1",
    "key2": {
        "subkey1": "subvalue1",
        "subkey2": {
            "subsubkey1": "subsubvalue1"
        }
    },
    "key3": "value3"
};

console.log(flattenWithPrefix(input, 'prefix_'));

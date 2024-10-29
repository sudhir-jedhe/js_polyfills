// _.set(object, path, value) is a handy method to updating an object without checking the property existence.

// Can you create your own set()?

const obj = {
  a: {
    b: {
      c: [1, 2, 3],
    },
  },
};

set(obj, "a.b.c", "BFE");
console.log(obj.a.b.c); // "BFE"

set(obj, "a.b.c.0", "BFE");
console.log(obj.a.b.c[0]); // "BFE"

set(obj, "a.b.c[1]", "BFE");
console.log(obj.a.b.c[1]); // "BFE"

set(obj, ["a", "b", "c", "2"], "BFE");
console.log(obj.a.b.c[2]); // "BFE"

set(obj, "a.b.c[3]", "BFE");
console.log(obj.a.b.c[3]); // "BFE"

console.log();
set(obj, "a.c.d[0]", "BFE");
// valid digits treated as array elements
console.log(obj.a.c.d[0]); // "BFE"

set(obj, "a.c.d.01", "BFE");
// invalid digits treated as property string
console.log(obj.a.c.d["01"]); // "BFE"

function set(obj, path, value) {
  path = Array.isArray(path)
    ? path
    : path.replace("[", ".").replace("]", "").split(".");
  src = obj;
  path.forEach((key, index, array) => {
    if (index == path.length - 1) {
      src[key] = value;
    } else {
      if (!src.hasOwnProperty(key)) {
        // if the key doesn't exist on object
        const next = array[index + 1];
        src[key] = String(Number(next)) === next ? [] : {}; // create a new object if next is item in array is not a number
      }
      src = src[key];
    }
  });
}

/******************************************* */

function set(obj: Record<string, any>, path: string | string[], value: any) {
  const strArray = Array.isArray(path)
    ? path
    : path.replace("[", ".").replace("]", "").split(".");

  let currentRef = obj;

  strArray.forEach((pathString, i) => {
    if (i === strArray.length - 1) {
      // if we're at the end, set the value
      currentRef[pathString] = value;
    } else {
      // we're not at the end, set the ref
      if (!currentRef[pathString]) {
        // the next path doesn't exist yet
        const nextPath = strArray[i + 1];
        currentRef[pathString] =
          String(Number(nextPath)) === nextPath // valid number ?
            ? [] // the next path is an array index
            : {}; // next path is anything but a valid number
      }
      currentRef = currentRef[pathString];
    }
  });
}

/**************************************************************** */

/**
 * @param {object} obj
 * @param {string} path
 * @param {any} value
 */
function set(obj, path, value) {
  const pathArry = Array.isArray(path)
    ? path
    : path.replace(/\[(.*)\]/g, ".$1").split(".");
  if (pathArry.length === 0) return;

  for (let i = 0; i < pathArry.length; i++) {
    const p = pathArry[i];

    if (i === pathArry.length - 1) {
      obj[p] = value;
      return;
    }

    if (!obj.hasOwnProperty(p)) {
      const nextP = pathArry[i + 1];
      // check next path
      if (String(Number(nextP)) === nextP) {
        // valid digit i.e) '1'
        obj[p] = [];
      } else {
        // invalid digit i.e) '01'
        obj[p] = {};
      }
    }

    obj = obj[p];
  }
}



function customSet(object, path, value) {
  if (!object || typeof object !== 'object') {
      throw new TypeError('First argument must be an object');
  }

  const pathArray = Array.isArray(path) ? path : path.split('.'); // Convert path to array if it's a string
  let current = object;

  // Iterate through the path array
  for (let i = 0; i < pathArray.length; i++) {
      const key = pathArray[i];

      // If we are at the last key, set the value
      if (i === pathArray.length - 1) {
          current[key] = value; // Set the value
      } else {
          // Create nested objects if they do not exist
          if (!current[key] || typeof current[key] !== 'object') {
              current[key] = {}; // Initialize as an empty object
          }
          current = current[key]; // Move deeper into the object
      }
  }
}

// Example usage
const data = {
  user: {
      info: {
          name: 'Alice',
          age: 30,
      },
  },
};

customSet(data, 'user.info.address.city', 'Wonderland');
console.log(data.user.info.address.city); // Output: 'Wonderland'

customSet(data, 'user.hobbies', ['reading', 'traveling']);
console.log(data.user.hobbies); // Output: ['reading', 'traveling']

customSet(data, ['user', 'info', 'age'], 31);
console.log(data.user.info.age); // Output: 31

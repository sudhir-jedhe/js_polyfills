// _.get(object, path, [defaultValue]) is a handy method to help retrieving data from an arbitrary object. if the resolved value from path is undefined, defaultValue is returned.

// Please create your own get().

const obj = {
  a: {
    b: {
      c: [1, 2, 3],
    },
  },
};

get(obj, "a.b.c"); // [1,2,3]
get(obj, "a.b.c.0"); // 1
get(obj, "a.b.c[1]"); // 2
get(obj, ["a", "b", "c", "2"]); // 3
get(obj, "a.b.c[3]"); // undefined
get(obj, "a.c", "bfe"); // 'bfe'

/**
 * @param {object} source
 * @param {string | string[]} path
 * @param {any} [defaultValue]
 * @return {any}
 */
function get(source, path, defaultValue = undefined) {
  // your code here
  const props = Array.isArray(path)
    ? path
    : path.replaceAll("[", ".").replaceAll("]", "").split(".");
  let curNode = source;
  for (let i = 0; i < props.length; i++) {
    let k = props[i];
    if (curNode[k] === undefined) return defaultValue;
    if (i === props.length - 1) return curNode[k];
    else curNode = curNode[k];
  }
}

/*********************************************** */

/**
 * @param {object} source
 * @param {string | string[]} path
 * @param {any} [defaultValue]
 * @return {any}
 */
function get(source, path, defaultValue = undefined) {
  // your code here
  const parts = Array.isArray(path)
    ? path
    : path.replaceAll("[", ".").replaceAll("]", "").split(".");

  if (parts.length === 0) {
    return defaultValue;
  }

  for (const part of parts) {
    if (source[part] === undefined) {
      return defaultValue;
    }
    source = source[part];
  }
  return source;
}

/*************************** */

/**
 * @param { object } source
 * @param { string | string[] } path
 * @param { any? } defaultValue
 * @returns { any }
 */
function get(source, path, defaultValue = undefined) {
  // 1. normalize the path into array notation
  // 2. get the result layer by layer
  const segs = Array.isArray(path) ? path : path.split(/[\.\[\]]+/g);

  if (segs[segs.length - 1] === "") {
    segs.pop();
  }

  if (segs.length === 0) {
    return defaultValue;
  }

  let result = source;

  while (result && segs.length > 0) {
    let head = segs.shift();
    result = result[head];
  }

  return result === undefined ? defaultValue : result;
}

/*********************************************** */
const obj = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
  },
};
const name = get("name", obj); // returns "John"
const city = get("city", obj); // returns "Anytown"
const zipCode = get("zipCode", obj); // returns undefined

export const get = (key, object) => {
  if (typeof object !== "object" || object === null) {
    return undefined;
  }

  if (key in object) {
    return object[key];
  }

  for (const objKey in object) {
    const value = get(key, object[objKey]);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

export const get = (key, object) => {
  if (typeof object !== "object" || object === null) {
    return undefined;
  }

  const stack = [object];

  while (stack.length > 0) {
    const currentObject = stack.pop();

    if (key in currentObject) {
      return currentObject[key];
    }

    for (const objKey in currentObject) {
      const value = currentObject[objKey];
      if (typeof value === "object" && value !== null) {
        stack.push(value);
      }
    }
  }

  return undefined;
};

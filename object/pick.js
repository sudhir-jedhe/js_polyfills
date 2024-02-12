/// lodash pick

function pick(object, keys) {
  // write your solution here
  const obj = {};

  if (!keys) return obj;

  keys.forEach((key) => {
    if (object[key]) obj[key] = object[key];
  });

  return obj;
}

/************************************** */

function pick(object, keys) {
  // write your solution here
  if (!keys) {
    return {};
  }
  return keys.reduce((acc, key) => {
    if (object[key]) {
      return { ...acc, [key]: object[key] };
    } else {
      return acc;
    }
  }, {});
}

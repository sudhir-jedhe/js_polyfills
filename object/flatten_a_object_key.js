const flattenObject = (obj, prefix = "") =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object") {
      return { ...acc, ...flattenObject(obj[k], pre + k) };
    } else {
      return { ...acc, [pre + k]: obj[k] };
    }
  }, {});

const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
  e: 4,
};

const flattenedObj = flattenObject(obj);

console.log(flattenedObj);

// {
//     "a": 1,
//     "b.c": 2,
//     "b.d": 3,
//     "e": 4,
//   }

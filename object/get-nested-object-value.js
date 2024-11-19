const deepGet = (obj, keys) => keys.reduce((xs, x) => xs?.[x] ?? null, obj);

const data = {
  foo: {
    foz: [1, 2, 3],
    bar: { baz: ['a', 'b', 'c'] },
  },
};

deepGet(data, ['foo', 'foz', 2]); // 3
deepGet(data, ['foo', 'bar', 'baz', 8, 'foz']); // null

/*********************************** */
const deepGet = (obj, keys) => keys.reduce((xs, x) => xs?.[x] ?? null, obj);

const deepGetByPaths = (obj, ...paths) =>
  paths.map(path =>
    deepGet(
      obj,
      path
        .replace(/\[([^\[\]]*)\]/g, '.$1.')
        .split('.')
        .filter(t => t !== '')
    )
  );

const data = {
  foo: {
    foz: [1, 2, 3],
    bar: { baz: ['a', 'b', 'c'] },
  },
};
deepGetByPaths(data, 'foo.foz[2]', 'foo.bar.baz.1', 'foo[8]');
// [3, 'b', null]


/******************************** */
// // search deep
// Search for a deeply nested property in an object
// Another unusual scenario is searching for a deeply nested property in an object. This is useful when you don't know the exact path to the property, but you know the key you're looking for. In this case, you can use a recursive function that will search for the key in the object and its nested properties.

// For this scenario, you can use the in operator to check if the target key exists in the object. If it does, you can return the value of the key. If it doesn't, you can use Object.values() and Array.prototype.reduce() to recursively call the function on each nested object until the first matching key/value pair is found.
const dig = (obj, target) =>
    target in obj
      ? obj[target]
      : Object.values(obj).reduce((acc, val) => {
          if (acc !== undefined) return acc;
          if (typeof val === 'object') return dig(val, target);
        }, undefined);
  
  const data = {
    foo: {
      foz: [1, 2, 3],
      bar: { baz: ['a', 'b', 'c'] },
    },
  };
  
  dig(data, 'foz'); // [1, 2, 3]
  dig(data, 'baz'); // ['a', 'b', 'c']

  /********************* */

  const get = (obj, path) => {
    // if path is not a string or array of string
    if (path === '' || path.length == 0) return undefined;
    
    // if path is an array, concatenate it and form a string
    // to handle a single case of string
    if (Array.isArray(path)) path = path.join('.');
    
    // filter out the brackets and dot
    let exactPath = [];
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== '[' && path[i] !== ']' && path[i] !== '.') {
        exactPath.push(path[i]);
      }
    }
    
    // get the value of the path in the sequence
    const value = exactPath.reduce((source, path) => source[path], obj);
    
    // if not found return undefined
    return value ? value : undefined;
  }


  Input:
const obj = {
  a: {
    b: {
      c: [1,2,3]
    }
  }
};

console.log(get(obj, 'a.b.c')); 
console.log(get(obj, 'a.b.c.0')); 
console.log(get(obj, 'a.b.c[1]')); 
console.log(get(obj, ['a', 'b', 'c', '2']));
console.log(get(obj, 'a.b.c[3]'));
console.log(get(obj, 'a.c')); 

Output:
// [1,2,3]
// 1
// 2
// 3
// undefined
// 'undefined'
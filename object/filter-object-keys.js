// Filter object properties by key
const pick = (obj, arr) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => arr.includes(k)));
  
  const omit = (obj, arr) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));
  
  const obj = { a: 1, b: '2', c: 3 };
  
  pick(obj, ['a', 'c']); // { 'a': 1, 'c': 3 }
  omit(obj, ['b']); // { 'a': 1, 'c': 3 }


// Filter object properties conditionally
  const pickBy = (obj, fn) =>
    Object.fromEntries(Object.entries(obj).filter(([k, v]) => fn(v, k)));
  
  const omitBy = (obj, fn) =>
    Object.fromEntries(Object.entries(obj).filter(([k, v]) => !fn(v, k)));
  
  const obj = { a: 1, b: '2', c: 3 };
  
  pickBy(obj, x => typeof x === 'number'); // { a: 1, c: 3 }
  omitBy(obj, x => typeof x !== 'number'); // { a: 1, c: 3 }
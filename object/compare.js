const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const a = { name: 'John', age: 26 };
const b = { name: 'John', age: 26 };

equals(a, b); // true

const c = { name: 'John' };
const d = { name: 'John', age: undefined };

equals(c, d); // true, should be false.


//deep compare

const equals = (a, b) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date)
      return a.getTime() === b.getTime();
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
      return a === b;
    if (a.prototype !== b.prototype) return false;
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every(k => equals(a[k], b[k]));
  };
  
  const a = { name: 'John', age: 26 };
  const b = { name: 'John', age: 26 };
  
  equals(a, b); // true
  
  const c = { name: 'John' };
  const d = { name: 'John', age: undefined };
  
  equals(c, d); // false



  const equals = (a, b) => {
    if (a === b) return true;
  
    if (a instanceof Date && b instanceof Date)
      return a.getTime() === b.getTime();
  
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
      return a === b;
  
    if (a.prototype !== b.prototype) return false;
  
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
  
    return keys.every(k => equals(a[k], b[k]));
  };
  
  equals(
    { a: [2, { e: 3 }], b: [4], c: 'foo' },
    { a: [2, { e: 3 }], b: [4], c: 'foo' }
  ); // true
  equals([1, 2, 3], { 0: 1, 1: 2, 2: 3 }); // true
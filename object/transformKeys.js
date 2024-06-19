const mapKeys = (obj, fn) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[fn(obj[k], k, obj)] = obj[k];
    return acc;
  }, {});

mapKeys({ a: 1, b: 2 }, (val, key) => key + val); // { a1: 1, b2: 2 }


const deepMapKeys = (obj, fn) =>
  Array.isArray(obj)
    ? obj.map(val => deepMapKeys(val, fn))
    : typeof obj === 'object'
    ? Object.keys(obj).reduce((acc, current) => {
        const key = fn(current);
        const val = obj[current];
        acc[key] =
          val !== null && typeof val === 'object' ? deepMapKeys(val, fn) : val;
        return acc;
      }, {})
    : obj;

const obj = {
  foo: '1',
  nested: {
    child: {
      withArray: [
        {
          grandChild: ['hello']
        }
      ]
    }
  }
};
const upperKeysObj = deepMapKeys(obj, key => key.toUpperCase());
/* {
  "FOO":"1",
  "NESTED":{
    "CHILD":{
      "WITHARRAY":[
        {
          "GRANDCHILD":[ 'hello' ]
        }
      ]
    }
  }
} */


  const renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] }
      }),
      {}
    );
  
  const obj = { name: 'Bobo', job: 'Front-End Master', shoeSize: 100 };
  renameKeys({ name: 'firstName', job: 'passion' }, obj);
  // { firstName: 'Bobo', passion: 'Front-End Master', shoeSize: 100 }

  const symbolizeKeys = obj =>
    Object.keys(obj).reduce(
      (acc, key) => ({ ...acc, [Symbol(key)]: obj[key] }),
      {}
    );
  
  symbolizeKeys({ id: 10, name: 'apple' });
  // { [Symbol(id)]: 10, [Symbol(name)]: 'apple' }



  const transform = (obj, fn, acc) =>
    Object.keys(obj).reduce((a, k) => fn(a, obj[k], k, obj), acc);
  
  transform(
    { a: 1, b: 2, c: 1 },
    (r, v, k) => {
      (r[v] || (r[v] = [])).push(k);
      return r;
    },
    {}
  ); // { '1': ['a', 'c'], '2': ['b'] }
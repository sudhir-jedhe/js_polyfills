// One of the differences between null and undefined is how they are treated differently in JSON.stringify().

// JSON.stringify({a: null})      // '{"a":null}'
// JSON.stringify({a: undefined}) // '{}'
// JSON.stringify([null])         // '[null]'
// JSON.stringify([undefined])    // '[null]'
// This difference might create troubles if there are missing alignments between client and server. It might be helpful to enforce using only one of them.

// You are asked to implement undefinedToNull() to return a copy that has all undefined replaced with null.

// undefinedToNull({a: undefined, b: 'BFE.dev'})
// // {a: null, b: 'BFE.dev'}
// undefinedToNull({a: ['BFE.dev', undefined, 'bigfrontend.dev']})
// // {a: ['BFE.dev', null, 'bigfrontend.dev']}


**
 * @param {any} arg
 * @returns any
 */
function undefinedToNull(arg) {
  if (Array.isArray(arg)) {
    return arg.map(undefinedToNull)
  } 
  
  if (typeof arg !== 'object') {
    return arg === undefined ? null : arg
  }
  for (let key in arg) {
    arg[key] = undefinedToNull(arg[key]) 
  }
  return arg
}


/***************** */


function undefinedToNull(arg) {
    if(arg === undefined) return null;
    if(Array.isArray(arg)) return arg.map(item => undefinedToNull(item));
    if(typeof arg === 'object' && arg !== null) return Object.keys(arg).reduce((acc, val) => {
      return {
        ...acc,
        [val]: undefinedToNull(arg[val])
      }
    }, {});
    return arg;
  }
  


  /**
 * @param {any} arg
 * @returns any
 */
function undefinedToNull(data) {
    if (Array.isArray(data)) {
      // If the data is an array, map through each element and apply undefinedToNull recursively
      return data.map(item => undefinedToNull(item));
    } else if (data && typeof data === 'object') {
      // If the data is an object, iterate through each key and apply undefinedToNull recursively
      return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] === undefined ? null : undefinedToNull(data[key]);
        return acc;
      }, {});
    } else {
      // If the data is neither an array nor an object, return it as is
      return (data===undefined ? null : data);
    }
  }
   1
   mute
  Share
  
  


  function undefinedToNull(obj: Record<any, any>): Record<any, any> {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            obj[key] = undefinedToNull(obj[key]);
        }
        if (obj[key] === undefined) {
            obj[key] = null;
        }
    }
    return obj;
}

/**
 * undefinedToNull({"a": undefined, "b": 3}) // {"a": null, "b": 3}
 * undefinedToNull([undefined, undefined]) // [null, null]
 */

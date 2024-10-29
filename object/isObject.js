function isObject(object) {
    return object && typeof object === 'object';
  }
  
  module.exports = isObject;



  /**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
function is(a, b) {
  if (a !== a) { // Only NaN is not equal to itself
    return b !== b; // returns true if the second parameter is NaN too
  }
  if (a === 0 && b === 0) { // -0 === 0 is true, so when both parameters equals to 0
    return 1 / a === 1 / b; // 1 / -0 is -Infinity and -Infinity === -Infinity
  }
  return a === b; // All other cases with regular === comparison
}



function is(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) {
      return true
    }
    
    if (a === 0 && b === 0 && 1 / a !== 1 / b) {
      return false
    }
  }
  
  return a === b
}


function is(a, b) {
  // this is for those cases:  Number.NaN, 0/0, NaN
  if(Number.isNaN(a) && Number.isNaN(b)) {
    return true
  }
  if(a === 0 && b === 0 && 1/a !== 1/b) {
    return false
  }
return a === b
}
function isObject(object) {
    return object && typeof object === 'object';
  }
  

function keys(object) {
  return isObject(object) ? Object.keys(object) : []; 
}

module.exports = keys;
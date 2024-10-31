const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let id = 0;
function getUniqueClassName() {
  let className = '';
  let num = id++;
  while (num >= 0) {
    className = chars[num % chars.length] + className;
    num = Math.floor(num / chars.length) - 1;
  }
  return className;
}
getUniqueClassName.reset = function() {
  id = 0;
}

/**************************** */



**
 * @returns {string}
 */
function getUniqueClassName() {
  // your code here
  getUniqueClassName.n = getUniqueClassName.n || 1
  
  function helper() {
    let count = getUniqueClassName.n++
    let className = ''
    while(count > 0) {
      let mod = (count - 1) % 52
      className = String.fromCharCode(mod < 26 ? (97/*a*/ + mod) : (65/*A*/ + (mod - 26))) + className
      count = Math.floor((count - 1) / 52)
    }
    return className
  }
  return helper()
}
getUniqueClassName.reset = function() {
  // your code here
  getUniqueClassName.n = 0
}


/******************** */

function getUniqueClassName() {
    let quotient = index++;
    let className = "";
    while(quotient >= 0) {
      className = str[quotient % strLength] + className;
      quotient = (quotient / strLength | 0) - 1;
    }
    return className;
  }
  getUniqueClassName.reset = function() {
    index = 0;
  }
  
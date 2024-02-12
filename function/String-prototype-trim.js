/**
 * @param {string} str
 * @return {string}
 */
function trim(str) {
  // your code here
  /*
      '/s' => it indicates single white space character
      '/s+' => here '+' is a greedy character that indicates one or more
            For example 'a+' signifies one or more a
      '^' indicates starting/leading characters of the expression
      '$' indicates end/trailing characters of the expression
      '|' similar to logical OR operator
  
      /^\s+|\s+$/ => characters matching with leading and trailing whitespaces
    */
  return str.replace(/^\s+|\s+$/g, "");
}

/************************************************* */
const WHITESPACES = [" ", "", "s", "\t", "\n", "\u3000"];
/**
 * @param {string} str
 * @return {string}
 */
function trim(str) {
  let wordStart = 0;
  let wordEnd = str.length;

  for (let i = 0; i < str.length; i++) {
    if (WHITESPACES.indexOf(str[i]) === -1) {
      wordStart = i;
      break;
    }
  }

  for (let j = str.length - 1; j >= 0; j--) {
    if (WHITESPACES.indexOf(str[j]) === -1) {
      wordEnd = j;
      break;
    }
  }

  return str.slice(wordStart, wordEnd + 1);
}

/*********************************** */

/**
 * @param {string} str
 * @return {string}
 */
// naive one
// function trim(str) {
//   const arr = [...str]

//   const reg = /\s/
//   while (reg.test(arr[0])) {
//     arr.shift()
//   }

//   while (reg.test(arr[arr.length - 1])) {
//     arr.pop()
//   }

//   return arr.join('')
// }

// for index
// function trim(str) {
//   const reg = /\s/
//   let start = 0
//   let end = str.length - 1

//   while (reg.test(str[start])) {
//     start += 1
//   }

//   while (reg.test(str[end])) {
//     end -= 1
//   }

//   return str.slice(start, end + 1)
// }

// regexp replacement
function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

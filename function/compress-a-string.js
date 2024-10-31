// Given a string, compress the repeating letters with count number

compress("a"); // 'a'
compress("aa"); // 'a2'
compress("aaa"); // 'a3'
compress("aaab"); // 'a3b'
compress("aaabb"); // 'a3b2'
compress("aaabba"); // 'a3b2a'

/**
 * @param {string} str
 * @return {string}
 */
function compress(str) {
  const res = [];
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    count++;
    if (str[i] !== str[i + 1]) {
      res.push(str[i]);
      if (count > 1) res.push(count);
      count = 0;
    }
  }
  return res.join("");
}

/******************************** */

**
 * @param {string} str
 * @return {string}
 */
function compress(str) {
  let currentChar = ''
  let currentCount = 0
  
  let result = ''
  
  for (let i = 0; i < str.length + 1; i++) {
    const char = str[i]
    if (char === currentChar) {
      currentCount += 1
    } else {
      result += 
        currentCount === 0 ? '' :
        currentCount === 1 ? currentChar : currentChar + currentCount
      currentChar = char
      currentCount = 1
    }
  }
  
  return result
}


/********************************** */

/**
 * @param {string} str
 * @return {string}
 */
function compress(str) {
    // your code here
    if (!str) {
        return str
    }
    return [...str].reduce((prev, item, index, arr = [...str]) => {
        if (arr[index] === arr[index - 1]) {
            const i = prev.lastIndexOf(arr[index])
            prev = prev.slice(0, i + 1) + ((+prev[i + 1] || 1) + 1)
        } else {
            prev += item
        }
        return prev
    }, '')
}


/********************************************* */
/**
 * @param {string} str
 * @return {string}
 */

function compress(str) {
    let result = '';
    let count = 0;
  
    for (let i = 0; i < str.length; i++) {
      count += 1;
      if (str[i] !== str[i + 1]) {
        result += `${str[i]}${count === 1 ? '' : count}`;
        count = 0;
      }
    }
  
    return result;
  }
  


  /****************************** */

  uncompress('3(ab)') // 'ababab'
uncompress('3(ab2(c))') // 'abccabccabcc'


const isNumeric = (str: string) => !isNaN(parseFloat(str)) && isFinite(Number(str))
function uncompress(str: string): string {
 const stack: string[] = []
  for (const char of str) {
    if (char !== ')') {
      stack.push(char)
    } else {
      let word = ''
      let count = ''
      // !1. 找字符串
      while (stack.length && stack[stack.length - 1] !== '(') word = stack.pop() + word
      stack.pop() 
      // !2.找重复次数
      while (stack.length && isNumeric(stack[stack.length - 1])) count = stack.pop() + count
      stack.push(word.repeat(Number(count)))
    }
  }
  return stack.join('')
}

/**************************** */

function uncompress(str) {
  const result = str.replace(/(\d+)\(([\D]*?)\)/gi, (_, multiplier, subString) => subString.repeat(multiplier))
  return result.includes("(") ? uncompress(result) : result;
}


/************************************ */


function uncompress(str) {
  const stack = [''];
  const count = [];
  let n = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/\d/.test(char)) {
      n += char;
    } else if (char === '(') {
      stack.push('');
      count.push(Number(n));
      n = '';
    } else if (char === ')') {
      const sequence = stack.pop();
      const times = count.pop();
      stack.push(stack.pop() + sequence.repeat(times));
    } else {
      stack.push(stack.pop() + char);
    }
  }
  return stack.pop();
}
 6
 m
 /********************************** */
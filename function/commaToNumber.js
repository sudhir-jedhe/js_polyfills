// Given a number, please create a function to add commas as thousand
// separators.

// addComma(1) // '1'
// addComma(1000) // '1,000'
// addComma(-12345678) // '-12,345,678'
// addComma(12345678.12345) // '12,345,678.12345'

/**
 * @param {number} num
 * @return {string}
 */

// naive solution
function addComma(num) {
  const sign = num < 0 ? -1 : 1;
  if (sign < 0) {
    num *= -1;
  }

  const str = num.toString();
  const [integer, fraction] = str.split(".");

  const arr = [];

  const digits = [...integer];
  for (let i = 0; i < digits.length; i++) {
    arr.push(digits[i]);
    // add extra commas
    // care for the 0
    const countOfRest = digits.length - (i + 1);
    if (countOfRest % 3 === 0 && countOfRest !== 0) {
      arr.push(",");
    }
  }

  const newInteger = (sign < 0 ? "-" : "") + arr.join("");

  if (fraction === undefined) return newInteger;
  return newInteger + "." + fraction;
}

/******************************************* */
// regular expression  1
function addComma(num) {
  const str = num.toString();
  let [integer, fraction] = str.split(".");

  while (true) {
    const next = integer.replace(/(\d+)(\d{3})/, "$1,$2");
    // 12345,678
    // 12,345,678
    if (next === integer) {
      break;
    }
    integer = next;
  }

  if (fraction === undefined) return integer;
  return integer + "." + fraction;
}

/******************************************* */
// regular expressiong global,
// (?= )
function addComma(num) {
  const str = num.toString();
  let [integer, fraction] = str.split(".");

  integer = integer.replace(/(\d)(?=(\d{3})+$)/g, "$1,");

  if (fraction === undefined) return integer;
  return integer + "." + fraction;
}

/********************************** */
function addComma(num) {
  const [number, fraction] = num.toString().split(".");
  const regex = /(\d)(?=(\d{3})+$)/gims;
  const commas = number.replace(regex, (_, $1) => `${$1},`);
  return `${commas}${fraction ? "." + fraction : ""}`;
}

/******************************* */
/**
 * @param {number} num
 * @return {string}
 */
function addComma(num) {
  const str = String(num);
  const numList = str.split(".");
  const numF = numList.length > 1 ? "." + numList[1] : "";

  return Number(numList[0]).toLocaleString() + numF;
}

/********************************* */

/* solution 1:  use toLocaleString*/
function addComma(num) {
  let [integer, float] = String(num).split(".");
  const fraction = float ? `.${float}` : "";
  return Number(integer).toLocaleString() + fraction;
}

/* solution 2:  for loop + slice*/
function addComma(num) {
  let [integer, float] = String(num).split(".");
  const fraction = float ? `.${float}` : "";

  for (let i = integer.length - 3; i > 0; i -= 3) {
    integer = integer.slice(0, i) + "," + integer.slice(i);
  }
  return `${integer}${fraction}`;
}

/**
 * @param {string} str
 * @return {object | Array | string | number | boolean | null}
 */
function parse(str) {
  if (str === "" || str[0] === "'") throw new Error();
  if (str === "null") return null;
  if (str === "{}") return {};
  if (str === "[]") return [];
  if (str === "true") return true;
  if (str === "false") return false;
  if (+str === +str) return Number(str);
  if (str[0] === '"') {
    return str.slice(1, -1); // Get rid of leading and trailing " from string
  }
  if (str[0] === "{") {
    return str
      .slice(1, -1)
      .split(",")
      .reduce((acc, cur) => {
        const index = [...cur].findIndex((s) => s === ":"); // or cur.indexOf(':')
        const key = cur.slice(0, index);
        const val = cur.slice(index + 1);
        acc[parse(key)] = parse(val);
        return acc;
      }, {});
  }
  if (str[0] === "[") {
    return str
      .slice(1, -1)
      .split(",")
      .map((el) => parse(el));
  }
}

// console.log(parse('[{"a":{"b":{"c":[1]}}},null,"str"]'))
/****************************************** */

/**
 * @param {string} str
 * @return {object | Array | string | number | boolean | null}
 */
function parse(str) {
  if (str === "") {
    throw Error();
  }
  if (str[0] === "'") {
    throw Error();
  }
  if (str === "null") {
    return null;
  }
  if (str === "{}") {
    return {};
  }
  if (str === "[]") {
    return [];
  }
  if (str === "true") {
    return true;
  }
  if (str === "false") {
    return false;
  }
  if (str[0] === '"') {
    return str.slice(1, -1);
  }
  if (+str === +str) {
    return Number(str);
  }
  if (str[0] === "{") {
    return str
      .slice(1, -1)
      .split(",")
      .reduce((acc, item) => {
        const index = item.indexOf(":");
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        acc[parse(key)] = parse(value);
        return acc;
      }, {});
  }
  if (str[0] === "[") {
    return str
      .slice(1, -1)
      .split(",")
      .map((value) => parse(value));
  }
}

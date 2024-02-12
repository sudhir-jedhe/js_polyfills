/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  if (data instanceof FileReader) return "object";
  return Object.prototype.toString
    .call(data)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

/*********************************** */

/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  // your code here
  if (data instanceof FileReader) return typeof data;
  return typeof data === "object"
    ? data === null
      ? "null"
      : data.constructor.name.toLowerCase()
    : typeof data;
}

/********************************** */

/**
 * @param {any} data
 * @return {string}
 */

let mapTypeToName = new Map([
  [Map, "map"],
  [Array, "array"],
  [ArrayBuffer, "arraybuffer"],
  [Set, "set"],
  [Date, "date"],
  [Function, "function"],
  [Number, "number"],
  [String, "string"],
  [Boolean, "boolean"],
]);

function detectType(data) {
  if (typeof data !== "object") {
    return typeof data;
  } else {
    if (data === null) return "null";
    for ([type, name] of mapTypeToName) {
      if (data instanceof type) return name;
    }
    return "object";
  }
}

/************************************************* */

/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  let dataT = data;
  if (dataT === null) return "null";
  if (dataT === undefined) return "undefined";
  if (dataT.constructor && dataTypes[dataT.constructor.name])
    return dataTypes[dataT.constructor.name];
  // your code here
}

const dataTypes = {
  Number: "number",
  Map: "map",
  Set: "set",
  Array: "array",
  Date: "date",
  Function: "function",
  ArrayBuffer: "arraybuffer",
  String: "string",
  Boolean: "boolean",
  Symbol: "symbol",
  FileReader: "object",
  BigInt: "bigint",
};

/***************************** */

/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
  if (typeof data == FileReader) return "object ";
  return Object.prototype.toString
    .call(data)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

// you can use constructor.name to print the constructor of the data but it has below issue

class ExampleClass {
  constructor() {
    // constructor logic
  }
}

const exampleObj = new ExampleClass();
const myData = "Hello";

console.log(myData.constructor.name.toLowerCase()); // string ✅ but below is incorrect,
console.log(exampleObj.constructor.name.toLowerCase()); // exampleclass ❌, logging constructor class
console.log(detectType(exampleObj)); // 'object' ✅

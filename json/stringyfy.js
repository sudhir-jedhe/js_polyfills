/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
  if ([NaN, null, undefined, Infinity].includes(data)) {
    return "null";
  }
  const type = typeof data;
  switch (type) {
    case "function":
      return undefined;
    case "bigint":
      throw Error("bigints are not supported");
    case "string":
      return `"${data}"`;
    case "object": {
      if (Array.isArray(data)) {
        return `[${data
          .map((e) => (typeof e == "symbol" ? "null" : stringify(e)))
          .join()}]`;
      }
      if (data instanceof Date) {
        return `"${data.toISOString()}"`;
      }
      return (
        "{" +
        Object.keys(data)
          .filter((key) => data[key] !== undefined)
          .map((key) => `"${key}":${stringify(data[key])}`)
          .join() +
        "}"
      );
    }
    default:
      return String(data);
  }
}

/**************************************** */

/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
  if (typeof data === "bigint") {
    throw new Error("Do not know how to serialize a BigInt at JSON.stringify");
  }
  if (typeof data === "string") {
    return `"${data}"`;
  }
  if (typeof data === "function") {
    return undefined;
  }
  if (data !== data) {
    return "null";
  }
  if (data === Infinity) {
    return "null";
  }
  if (data === -Infinity) {
    return "null";
  }
  if (typeof data === "number") {
    return `${data}`;
  }
  if (typeof data === "boolean") {
    return `${data}`;
  }
  if (data === null) {
    return "null";
  }
  if (data === undefined) {
    return "null";
  }
  if (typeof data === "symbol") {
    return "null";
  }
  if (data instanceof Date) {
    return `"${data.toISOString()}"`;
  }
  if (Array.isArray(data)) {
    const arr = data.map((el) => stringify(el));
    return `[${arr.join(",")}]`;
  }
  if (typeof data === "object") {
    const arr = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      acc.push(`"${key}":${stringify(value)}`);
      return acc;
    }, []);
    return `{${arr.join(",")}}`;
  }
}

/******************************************* */
/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
  const typeOfData = detectDataType(data);

  if (typeOfData === "array") {
    return stringifyArr(data);
  }

  if (typeOfData === "object" || typeOfData === "map") {
    return stringifyObj(data);
  }

  return _stringify(typeOfData, data);
}

function stringifyObj(data) {
  let stringifiedData = [];

  for (const key of Object.keys(data)) {
    const val = data[key];
    const typeOfVal = detectDataType(val);

    if (
      typeOfVal === "symbol" ||
      typeOfVal === "function" ||
      typeOfVal === "undefined"
    ) {
      continue;
    }

    let stringifiedKey = `\"${key}\":`;

    switch (typeOfVal) {
      case "array":
        stringifiedKey += stringifyArr(val);
        break;
      case "object":
      case "map":
        stringifiedKey += stringifyObj(val);
        break;
      default:
        stringifiedKey += _stringify(typeOfVal, val);
    }

    stringifiedData.push(stringifiedKey);
  }

  return `{${stringifiedData.join(",")}}`;
}

function stringifyArr(data) {
  let stringifiedData = [];

  for (const [index, val] of data.entries()) {
    if (isNaN(index)) {
      continue;
    }

    const typeOfVal = detectDataType(val);

    switch (typeOfVal) {
      case "array":
        stringifiedData.push(stringifyArr(val));
        break;
      case "object":
      case "map":
        stringifiedData.push(stringifyObj(val));
        break;
      default:
        stringifiedData.push(_stringify(typeOfVal, val));
    }
  }

  return `[${stringifiedData.join(",")}]`;
}

function _stringify(typeOfData, data) {
  switch (typeOfData) {
    case "string":
      return `\"${data}\"`;
    case "number":
    case "boolean":
      return String(data);
    case "function":
      return undefined;
    case "date":
      return `"${data.toISOString()}"`;
    case "set":
    case "map":
    case "weakSet":
    case "weakMap":
      return "{}";
    case "bigint":
      throw new Error("TypeError: BigInt value can't be serialized in JSON");
    default:
      return "null";
  }
}

const dataTypes = new Map([
  [Number, "number"],
  [String, "string"],
  [Boolean, "boolean"],
  [Array, "array"],
  [ArrayBuffer, "arraybuffer"],
  [Date, "date"],
  [Set, "set"],
  [Map, "map"],
  [WeakSet, "weakSet"],
  [WeakMap, "weakMap"],
]);

function detectDataType(data) {
  if (typeof data === "number" && isNaN(data)) {
    return "NaN";
  }

  if (data === Infinity) {
    return "infinity";
  }

  if (typeof data !== "object") {
    return typeof data;
  }

  if (data === null) {
    return "null";
  }

  for (const [type, name] of dataTypes.entries()) {
    if (data instanceof type) {
      return name;
    }
  }

  return "object";
}

/******************************************* */

/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
  if (typeof data === "bigint") throw new Error("Required to throw on BigInt");
  if (
    data === Infinity ||
    data === -Infinity ||
    data !== data || // Handle NaN
    data === null ||
    typeof data === "symbol" ||
    typeof data === "undefined"
  ) {
    return `null`;
  }
  if (typeof data === "string") return `"${data}"`;
  if (typeof data === "number" || typeof data === "boolean") return `${data}`;
  if (typeof data === "function") return undefined;
  if (data instanceof Date) {
    return `"${data.toISOString()}"`;
  }
  if (Array.isArray(data)) {
    let result = "[";
    result += data.map((el) => stringify(el)).join(",");
    result += "]";
    return result;
  }
  if (typeof data === "object") {
    let result = "{";
    const buffer = [];
    Object.entries(data).forEach(([key, val], idx) => {
      if (typeof val !== "undefined") {
        buffer.push(`"${key}":${stringify(val)}`);
      }
    });
    result += buffer.join(",");
    result += "}";
    return result;
  }
  return `${data}`; // Catch all
}

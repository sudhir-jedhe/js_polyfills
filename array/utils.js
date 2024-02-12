const isFunction = (func: any) => typeof func === "function";

const isObject = (supposedObject: any) =>
  typeof supposedObject === "object" &&
  supposedObject !== null &&
  !Array.isArray(supposedObject);

const isThenable = (obj: any) => isObject(obj) && isFunction(obj.then);

const identity = (val: any) => val;

export { isObject, isThenable, identity, isFunction };

/********************************************************************** */
export function isBoolean(value) {
  return value === true || value === false;
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isNull(value) {
  return value === null;
}

export function isString(value) {
  return typeof value === "string";
}

export function isSymbol(value) {
  return typeof value === "symbol";
}

export function isUndefined(value) {
  return value === undefined;
}

/*********************************** */
export function isArray(value) {
  return Array.isArray(value);
}

// Alternative to isArray.
export function isArrayAlt(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  return value.constructor === Array;
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const type = typeof value;
  return type === "object" || type === "function";
}

export function isPlainObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

// Alternative to isPlainObject, Lodash's implementation.
export function isPlainObjectAlternative(value) {
  if (!isObject(value)) {
    return false;
  }

  // For objects created via Object.create(null);
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

// One of the differences between null and undefined is how they are treated differently in JSON.stringify().

JSON.stringify({ a: null }); // '{"a":null}'
JSON.stringify({ a: undefined }); // '{}'

JSON.stringify([null]); // '[null]'
JSON.stringify([undefined]); // '[null]'
// This difference might create troubles if there are missing alignments between client and server. It might be helpful to enforce using only one of them.

// You are asked to implement undefinedToNull() to return a copy that has all undefined replaced with null.

undefinedToNull({ a: undefined, b: "BFE.dev" });
// {a: null, b: 'BFE.dev'}

undefinedToNull({ a: ["BFE.dev", undefined, "bigfrontend.dev"] });
// {a: ['BFE.dev', null, 'bigfrontend.dev']}

/**
 * @param {any} arg
 * @returns any
 */
const replacer = (key, val) => (typeof val === "undefined" ? null : val);
const undefinedToNull = (arg) => JSON.parse(JSON.stringify(arg, replacer));

/******************************** */

/**
 * @param {any} arg
 * @returns any
 */
function undefinedToNull(arg) {
  if (typeof arg !== "object" || arg === null) {
    return arg ?? null;
  }

  for (const [key, value] of Object.entries(arg)) {
    if (value === undefined) {
      arg[key] = null;
    } else {
      arg[key] = undefinedToNull(value);
    }
  }

  return arg;
}

/************************* */
/**
 * @param {any} arg
 * @returns any
 */
function undefinedToNull(arg) {
  if (Array.isArray(arg)) {
    return arg.map(undefinedToNull);
  }

  if (typeof arg !== "object") {
    return arg === undefined ? null : arg;
  }

  for (let key in arg) {
    arg[key] = undefinedToNull(arg[key]);
  }

  return arg;
}

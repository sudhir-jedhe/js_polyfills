/**
 * Camelise an object.
 *
 * Deeply convert snake_case / kebab-case keys to camelCase, walking through
 * nested objects and arrays. The values are left as-is.
 */

/** 'user_first_name' | 'user-first-name' -> 'userFirstName' */
function toCamelCase(key) {
  return String(key)
    .replace(/[-_\s]+(.)?/g, (_, ch) => (ch ? ch.toUpperCase() : ''))
    .replace(/^[A-Z]/, (ch) => ch.toLowerCase());
}

/** 'userFirstName' -> 'user_first_name' */
function toSnakeCase(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

/**
 * Deeply transform every key with `transform`.
 * @param {*} value
 * @param {(key:string) => string} transform
 */
function mapKeysDeep(value, transform) {
  if (Array.isArray(value)) return value.map((item) => mapKeysDeep(item, transform));

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[transform(key)] = mapKeysDeep(val, transform);
    }
    return out;
  }

  return value; // primitives, Date, Map, class instances pass through
}

const cameliseObject = (obj) => mapKeysDeep(obj, toCamelCase);
const snakeiseObject = (obj) => mapKeysDeep(obj, toSnakeCase);

// ---- Examples ----
const api = {
  user_id: 1,
  'first-name': 'Sudhir',
  contact_info: { phone_number: '123', tags: [{ tag_name: 'a' }] },
};

console.log(JSON.stringify(cameliseObject(api)));
// {"userId":1,"firstName":"Sudhir","contactInfo":{"phoneNumber":"123","tags":[{"tagName":"a"}]}}

console.log(JSON.stringify(snakeiseObject({ userId: 1, contactInfo: { phoneNumber: '9' } })));
// {"user_id":1,"contact_info":{"phone_number":"9"}}

module.exports = { cameliseObject, snakeiseObject, mapKeysDeep, toCamelCase, toSnakeCase };

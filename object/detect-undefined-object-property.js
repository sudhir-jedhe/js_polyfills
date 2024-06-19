const obj = { prop : undefined };
obj.prop === undefined; // true
typeof obj.prop === 'undefined'; // true
obj.porp === undefined; // true
typeof obj.porp === 'undefined'; // true


// To alleviate the issue, Object.prototype.hasOwnProperty() can be used in addition to the previous method to check for the property actually being present on the object. Moreover, it can also be used for the opposite, so you can also detect non-existent properties and handle them accordingly.

const hasUndefinedProperty = (obj, prop) =>
  obj.hasOwnProperty(prop) && obj[prop] === undefined;

const obj = { prop: undefined };
hasUndefinedProperty(obj, 'prop'); // true
hasUndefinedProperty(obj, 'porp'); // false
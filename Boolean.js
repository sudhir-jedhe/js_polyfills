const values = [0, 0, 2, 0, 3];
// Use as the callback for Array.prototype.some()
const hasValidValue = values.some(Boolean);
// Use as the callback for Array.prototype.filter()
const nonEmptyValues = values.filter(Boolean);


Boolean(false);         // false
Boolean(undefined);     // false
Boolean(null);          // false
Boolean('');            // false
Boolean(NaN);           // false
Boolean(0);             // false
Boolean(-0);            // false
Boolean(0n);            // false

Boolean(true);          // true
Boolean('hi');          // true
Boolean(1);             // true
Boolean([]);            // true
Boolean([0]);           // true
Boolean([1]);           // true
Boolean({});            // true
Boolean({ a: 1 });      // true
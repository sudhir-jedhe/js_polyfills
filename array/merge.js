const a = [1, 2, 3];
const b = [4, 5, 6];

const merged = [...a, ...b]; // [1, 2, 3, 4, 5, 6]


const a = [1, 2, 3];
const b = [4, 5, 6];

const merged = [].concat(a, b); // [1, 2, 3, 4, 5, 6]
// -- OR --
const alsoMerged = a.concat(b); // [1, 2, 3, 4, 5, 6]


const a = [1, 2, 3];
const b = true;
const c = 'hi';

const spreadAb = [...a, ...b]; // Error: b is not iterable
const spreadAc = [...a, ...c]; // [1, 2, 3, 'h', 'i'], wrong result
// You should use [...a, b] and [...a, c] instead

const concatAb = [].concat(a, b); // [1, 2, 3, true]
const concatAb = [].concat(a, c); // [1, 2, 3, 'hi']
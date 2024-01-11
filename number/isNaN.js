const a = "BFE.dev";
const b = 1;

console.log(Number.isNaN(a));
console.log(Number.isNaN(b));
console.log(isNaN(a));
console.log(isNaN(b));

console.log(NaN == NaN);
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log([NaN].indexOf(NaN));
console.log([NaN].includes(NaN));
console.log(Math.max(NaN, 1));
console.log(Math.min(NaN, 1));
console.log(Math.min(NaN, Infinity));

const arr = [];
arr[2 ** 32 - 2] = 1;
arr[2 ** 32 - 1] = 2;
console.log(arr.at(-1));

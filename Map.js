let stones = new Map();

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");
stones.set(3, "opal");
stones.set(4, "amethyst");

console.log(stones);

console.log(stones.get(0));
console.log(stones.get(3));
console.log(stones.get(9));


/****************************************** */

let stones = new Map();

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");

let stones2 = new Map(stones);

console.log(stones);
console.log(stones2);

let items = new Map([["coin", 3], ["pen", 4], ["cup", 3]]);
console.log(items);


/***************************************************** */
let stones = new Map();

console.log(`The size is ${stones.size}`);

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");

console.log(`The size is ${stones.size}`);

stones.set(3, "opal");
stones.set(4, "amethyst");

console.log(`The size is ${stones.size}`);

stones.clear();

console.log(`The size is ${stones.size}`);

/*********************************************************************** */
let stones = new Map();

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");
stones.set(3, "opal");
stones.set(4, "amethyst");

for (const entry of stones)) {
  console.log(entry);
}

console.log('-------------------------------');

for (const [k, v] of stones.entries()) {
  console.log(`${k}: ${v}`);
}

console.log('-------------------------------');

for (const val of stones.values()) {
  console.log(val);
}

console.log('-------------------------------');

for (const key of stones.keys()) {
  console.log(key);
}

/****************************************** */
let stones = new Map();

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");
stones.set(3, "opal");
stones.set(4, "amethyst");

stones.forEach((v, k) => {
    console.log(`${k} has value ${v}`);
});

/************************************* */
let stones = new Map();

stones.set(0, "citrine");
stones.set(1, "garnet");
stones.set(2, "topaz");
stones.set(3, "opal");
stones.set(4, "amethyst");

let stones2d = Array.from(stones);
let keys = Array.from(stones.keys());
let values = Array.from(stones.values());

console.log(stones2d);
console.log([...stones]);

console.log('--------------------');

console.log(keys);
console.log(values);

/*********************************** */
const assert = require('assert');

let stones1 = new Map();

stones1.set(0, "citrine");
stones1.set(1, "garnet");
stones1.set(2, "topaz");

let stones2 = new Map();
stones2.set(3, "opal");
stones2.set(4, "amethyst");

let stones = new Map([...stones1, ...stones2])

console.log(stones);
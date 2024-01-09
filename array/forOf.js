let words = ['pen', 'pencil', 'falcon', 'rock', 'sky', 'earth'];

for (let word of words) {

    console.log(word);
}

let stones = new Map([[1, "garnet"], [2, "topaz"],
    [3, "opal"], [4, "amethyst"]]);
  
for (let e of stones) {

    console.log(e);
}

console.log('------------------------');

for (let [k, v] of stones) {

    console.log(`${k}: ${v}`);
}
const arr = [1, , , 2];

// forEach
arr.forEach((i) => console.log(i));

// map
console.log(arr.map((i) => i * 2));

// for ... of
for (const i of arr) {
  console.log(i);
}

// spread
console.log([...arr]);

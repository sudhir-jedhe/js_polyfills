const arr = [1, 2, 3, 4];

const sum = arr.reduce((previousValue, currentValue) => {
  const nextValue = previousValue + currentValue;
  return nextValue;
}, 0);

console.log(sum);
// 10

const product = arr.reduce((previousValue, currentValue) => {
  const nextValue = previousValue * currentValue;
  return nextValue;
}, 1);

console.log(product);
// 24
Array.prototype.square = function () {
  return this.map((number) => number ** 2);
};

const numbers = [1, 2, 3, 4, 5];

const squaredNumbers = numbers.square();

console.log(squaredNumbers); // [1, 4, 9, 16, 25]

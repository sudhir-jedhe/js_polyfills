const randomInt = randomInRange(1, 10);
console.log(randomInt); //  output: a random integer between 1 and 9

export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

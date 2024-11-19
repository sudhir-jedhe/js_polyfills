// Repeating a single value
// To create a generator that repeats a single value indefinitely, you can use a non-terminating while loop, that will yield a value every time Generator.prototype.next() is called. You can also use the return value of the yield statement to update the returned value if the passed value is not undefined.

const repeatGenerator = function* (val) {
  let v = val;
  while (true) {
    let newV = yield v;
    if (newV !== undefined) v = newV;
  }
};

const repeater = repeatGenerator(5);
repeater.next(); // { value: 5, done: false }
repeater.next(); // { value: 5, done: false }
repeater.next(4); // { value: 4, done: false }
repeater.next(); // { value: 4, done: false }
// Repeating an array of values
// To create a generator that repeats an array of values indefinitely, you can use the same approach as before for the non-terminating while loop and yield a value every time Generator.prototype.next() is called. In order to cycle through the array, you can use the modulo operator (%) with Array.prototype.length to get the next value's index and increment the counter after each yield statement.

const cycleGenerator = function* (arr) {
  let i = 0;
  while (true) {
    yield arr[i % arr.length];
    i++;
  }
};

const binaryCycle = cycleGenerator([0, 1]);
binaryCycle.next(); // { value: 0, done: false }
binaryCycle.next(); // { value: 1, done: false }
binaryCycle.next(); // { value: 0, done: false }
binaryCycle.next(); // { value: 1, done: false }





function* cycleGenerator(arr: number[], startIndex: number): Generator<number, void, number> {
  const n = arr.length;
  while (true) {
      const jump = yield arr[startIndex];
      startIndex = (((startIndex + jump) % n) + n) % n;
  }
}
/**
*  const gen = cycleGenerator([1,2,3,4,5], 0);
*  gen.next().value  // 1
*  gen.next(1).value // 2
*  gen.next(2).value // 4
*  gen.next(6).value // 5
*/
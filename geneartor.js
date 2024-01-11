//return in Generator
function* gen() {
  try {
    yield 1;
    yield 2;
    return 3;
    yield 4;
  } finally {
    yield 5;
    return 6;
    yield 7;
  }
}

console.log([...gen()]);
/**************************************** */

// return in Generator 2
function* g() {
  console.log(1);
  try {
    console.log(2);
    yield 2;
    console.log(3);
    throw new Error("error");
  } finally {
    console.log(4);
  }
}

const obj = g();
obj.next();
obj.return();

/********************************************* */
// Generator return()

function* gen() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
  }
  yield 5;
}

const g = gen();
console.log(g.next().value);
console.log(g.next().value);
console.log(g.return(6).value);
console.log(g.next().value);
console.log(g.next().value);

/********************************************************* */

function* genA() {
  yield [1, 2, 3];
}

function* genB() {
  yield* [1, 2, 3];
}

console.log(genA().next().value);
console.log(genB().next().value);

/************************* */
// This is a JavaScript Quiz from BFE.dev

function* gen() {
  yield 2 * (yield 100);
}

const generator = gen();
console.log(generator.next().value);
console.log(generator.next(1).value);
console.log(generator.next(1).value);

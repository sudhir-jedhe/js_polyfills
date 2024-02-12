function Increment() {
  if (!(this instanceof Increment)) {
    return new Increment();
  }

  this.value = 0;
}

Increment.prototype[Symbol.toPrimitive] = function () {
  return ++this.value;
};

let increment1 = new Increment();
let increment2 = Increment();

console.log(increment1 == +increment2); // true
console.log(`val: ${increment1}`); // val: 1
console.log(`val: ${increment1}`); // val: 2
console.log(`val: ${increment1}`); // val: 3

const counter = {
  value: 0,
  get value() {
    return ++this.value;
  },
};

console.log(counter.value, counter.value, counter.value); // 1 2 3

const counter = (function () {
  let privateCounter = 0;
  function changeByValue(value) {
    privateCounter += value;
  }
  return {
    increment() {
      changeByValue(1);
    },
    decrement() {
      changeByValue(-1);
    },
    value() {
      return privateCounter;
    },
  };
})();

console.log(counter.value()); // 0.

counter.increment();
counter.increment();
console.log(counter.value()); // 2.

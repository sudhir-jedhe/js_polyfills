// Please create a function count(), when called it should return how many times it has been called, count.reset() should also implemented.

count(); // 1
count(); // 2
count(); // 3

count.reset();

count(); // 1
count(); // 2
count(); // 3

const count = (() => {
  let num = 0;
  const func = () => ++num;
  func.reset = () => (num = 0);
  return func;
})();

/********************** */

function count() {
  count.val = count.val || 1;
  return count.val++;
}

count.reset = function () {
  count.val = 1;
};

/*************************** */

const count = (() => {
  let num = 0;

  const func = () => {
    return ++num;
  };
  func.reset = () => {
    num = 0;
  };
  return func;
})();

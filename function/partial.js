// implement _.partial()

// _.partial() works like Function.prototype.bind() but this is not bound.

const func = (...args) => args;

const func123 = partial(func, 1, 2, 3);

func123(4);
// [1,2,3,4]

function partial(func, ...args) {
  return function (...restArgs) {
    const copyArgs = args.map((arg) =>
      arg === partial.placeholder ? restArgs.shift() : arg
    );
    return func.call(this, ...copyArgs, ...restArgs);
  };
}
partial.placeholder = Symbol();

/**
 * @param {Function} func
 * @param {any[]} args
 * @returns {Function}
 */
function partial(func, ...args) {
  return function () {
    let mergedArguments = [];
    let i = 0;
    args.forEach((el) => {
      mergedArguments.push(el === partial.placeholder ? arguments[i++] : el);
    });
    mergedArguments = [
      ...mergedArguments,
      ...Array.from(arguments).slice(i, arguments.length),
    ];
    return func.apply(this, mergedArguments);
  };
}

partial.placeholder = Symbol();

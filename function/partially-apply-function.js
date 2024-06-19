const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);

const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetHello = partial(greet, 'Hello');
greetHello('John'); // 'Hello John!'
// Append arguments to a function
// Similarly, you can partially apply a function by appending arguments using the spread operator (...). You need only pass them to fn after any other arguments that are supplied.

const partialRight = (fn, ...partials) => (...args) => fn(...args, ...partials);

const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetJohn = partialRight(greet, 'John');
greetJohn('Hello'); // 'Hello John!'
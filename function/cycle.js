// Implement a function that takes one or more values and returns a function that cycles through those values each time it is called.

// Examples
// const helloFn = cycle('hello');
// console.log(helloFn()); // "hello"
// console.log(helloFn()); // "hello"

// const onOffFn = cycle('on', 'off');
// console.log(onOffFn()); // "on"
// console.log(onOffFn()); // "off"
// console.log(onOffFn()); // "on"

/**
 * @template T
 * @param  {...T} values
 *
 * @returns () => T
 */
export default function cycle(...values) {
  throw "Not implemented";
}

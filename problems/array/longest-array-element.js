Longest item in array

Takes any number of iterable objects or objects with a length property and returns the longest one.

Use Array.prototype.reduce(), comparing the length of objects to find the longest one.
If multiple objects have the same length, the first one will be returned.
Returns undefined if no arguments are provided.
const longestItem = (...vals) =>
  vals.reduce((a, x) => (x.length > a.length ? x : a));

longestItem('this', 'is', 'a', 'testcase'); // 'testcase'
longestItem(...['a', 'ab', 'abc']); // 'abc'
longestItem(...['a', 'ab', 'abc'], 'abcd'); // 'abcd'
longestItem([1, 2, 3], [1, 2], [1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]
longestItem([1, 2, 3], 'foobar'); // 'foobar'
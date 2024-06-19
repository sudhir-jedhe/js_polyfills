Set operations in JavaScript

Mathematical set operations can be easily applied to JavaScript Set objects and arrays. This collection of snippets will introduce you to the most common set operations, such as union, intersection and difference.

💬  Note
At the time of writing, native support for this operation is coming to the Set object, yet it's still in the early stages. Make sure to check environment compatibility if you're planning to use the native methods.

Union
The union of two sets is a set containing all elements that exist in any of the two sets at least once. In order to calculate it, you can use the spread operator (...) to convert the Set objects to array and create a new Set from the resulting array.

const union = (a, b) => new Set([...a, ...b]);

union(new Set([1, 2, 3]), new Set([4, 3, 2]));
// Set(4) { 1, 2, 3, 4 }
Intersection
The intersection of two sets is a set containing all elements that exist in both sets. In order to calculate it, you can use Array.prototype.filter() and Set.prototype.has() to filter out all elements that don't exist in the second set.

const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

intersection(new Set([1, 2, 3]), new Set([4, 3, 2]));
// Set(2) { 2, 3 }
Difference
The difference of two sets is a set containing all elements that exist in the first set but not in the second set. In order to calculate it, you can use the same approach as the intersection, but negating the result of Set.prototype.has().

const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

difference(new Set([1, 2, 3]), new Set([4, 3, 2]));
// Set(1) { 1 }
Symmetric Difference
The symmetric difference of two sets is a set containing all elements that exist in either of the sets but not in both. In order to calculate it, you can calculate the difference of each set with the other and then calculate the union of the two results.

const symmetricDifference = (a, b) =>
  new Set([...[...a].filter(x => !b.has(x)), ...[...b].filter(x => !a.has(x))]);

symmetricDifference(new Set([1, 2, 3]), new Set([4, 3, 2]));
// Set(2) { 1, 4 }
Application to arrays
All of these snippets can be easily applied to arrays or other iterables by converting them to Set objects and then converting the resulting Set objects back to the original type.

On top of that, arrays can leverage potential performance optimizations, depending on the use-case. For example, you can use Array.prototype.some() and Array.prototype.includes() to check if two arrays intersect, instead of having to calculate their intersection.

const intersects = (a, b) => a.some(x => b.includes(x));

intersects(['a', 'b'], ['b', 'c']); // true
intersects(['a', 'b'], ['c', 'd']); // false
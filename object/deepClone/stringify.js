// Writing out a complete deep clone solution from scratch is almost impossible
// under typical interview constraints. In typical interview settings, the scope
// is fairly limited, and interviewers are more interested in how you would
// detect different data types and your ability to leverage various built-in
// APIs and Object methods to traverse a given object.

// The easiest (but flawed) way to deep copy an object in JavaScript is to first
// serialize it and then deserialize it back via JSON.stringify and JSON.parse.

export default function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
// Although this approach is acceptable given the input object only contains
// null, boolean, number, string, you should be aware of the downsides of this
// approach:

// We can only copy non-symbol-keyed properties whose values are supported by
// JSON. Unsupported data types are simply ignored. JSON.stringify also has
// other a few surprising behaviors such as converting Date objects to ISO
// timestamp strings, NaN and Infinity becoming null etc.

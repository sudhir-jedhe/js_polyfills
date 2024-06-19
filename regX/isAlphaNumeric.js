Oftentimes, strings are used to represent data that should only contain alphabetic or alphanumeric characters. Using regular expressions, you can easily check if a string matches the pattern.

Check if a string contains only alpha characters
For alpha (alphabetic) characters, you can use a range ([a-zA-Z]) to match any character from a to z (lowercase) and A to Z (uppercase). Simply adding the * quantifier and the positional anchors (^ and $) will ensure that the pattern matches the entire string. Then, you can use RegExp.prototype.test() to check if the given string matches against the alphabetic pattern.

const isAlpha = str => /^[a-zA-Z]*$/.test(str);

isAlpha('sampleInput'); // true
isAlpha('this Will fail'); // false
isAlpha('123'); // false
Check if a string contains only alphanumeric characters
Subsequently, you can extend the pattern to include digits (0-9) by adding them to the range. The resulting pattern will be [a-zA-Z0-9]. Adding the gi flags makes the pattern case-insensitive, allowing for the range to be simplified to [a-z0-9].

const isAlphaNumeric = str => /^[a-z0-9]*$/gi.test(str);

isAlphaNumeric('hello123'); // true
isAlphaNumeric('123'); // true
isAlphaNumeric('hello 123'); // false (space character is not alphanumeric)
isAlphaNumeric('#$hello'); // false
💡  Tip
These methods can serve as a great starting point for more complex string validation patterns. You can further customize the regular expressions to suit your specific requirements (e.g. allowing spaces, hyphens, or underscores in the string).
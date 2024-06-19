Exact string match
Use the ^ and $ anchors to match the start and end of the string, respectively.
Add the string you want to match in-between the two anchors.
const regexp = /^abc$/;
// Where 'abc' is the exact string you want to match
Match empty string
Use the ^ and $ anchors to match the start and end of the string, respectively.
Do not add any characters in-between to match an empty string.
const regexp = /^$/;
Match whitespace sequences
Use the \s meta-sequence to match any whitespace character, including spaces, tabs, newlines, etc.
Use the + quantifier to match one or more occurrences of the previous character.
Add the global flag (g) to match all occurrences of the pattern in the string.
const regexp = /\s+/g;
Match line breaks
Depending on the environment, line breaks can be represented in different ways.
Use the \r character to match carriage returns, the \n character to match newlines, and the \r\n sequence to match carriage returns followed by newlines.
Add the global (g) and multiline (m) flags to match all occurrences of the pattern in the string.
const regexp = /\r|\n|\r\n/gm;
Match non-word characters
Use negation (^) to match any character that is not a word character (\w) or a whitespace character (\s).
Add the global flag (g) to match all occurrences of the pattern in the string.
Add the ignore case flag (i) to match both uppercase and lowercase characters.
const regexp = /[^\w\s]/gi;
Match alphanumeric, dashes and hyphens
Use the ^ and $ anchors to match the start and end of the string, respectively.
Use the a-zA-Z0-9- pattern to match any alphanumeric character, dashes and hyphens.
Use the + quantifier to match one or more occurrences of the previous character.
Particularly useful when matching URL slugs.
const regexp = /^[a-zA-Z0-9-_]+$/;
Match letters and whitespaces
Use the ^ and $ anchors to match the start and end of the string, respectively.
Use the a-zA-Z\s pattern to match any letter and whitespace character.
Use the + quantifier to match one or more occurrences of the previous pattern.
const regexp = /^[A-Za-z\s]+$/;
Pattern not included
Use the ^ and $ anchors to match the start and end of the string, respectively.
Use a negative lookahead (?!) to match any character that is not followed by the pattern you want to exclude.
Add the global flag (g) to match all occurrences of the pattern in the string.
To ensure more than one pattern is not included, use the | character to separate them.
const regexp = /^((?!(abc|bcd)).)*$/;
// Where 'abc' and 'bcd' are pattern you want to exclude
Text inside brackets
Use the \( and \) characters to match the opening and closing brackets, respectively.
Use a capturing group between the two and exclude the closing parenthesis character.
Use the + quantifier to match one or more characters, as needed.
Add the global flag (g) to match all occurrences of the pattern in the string.
Replace \( and \) with \[ and \] to match square brackets and with \{ and \} to match curly brackets.
const regexp = /\(([^)]+)\)/g;
Validate GUID/UUID
Use the ^ and $ anchors to match the start and end of the string, respectively.
Validate each segment of the GUID/UUID separately using numeric character ranges and quantifiers.
const regexp = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
Validate date format (DD/MM/YYYY)
Use the ^ and $ anchors to match the start and end of the string, respectively.
Validate each segment of the date separately using numeric character ranges and quantifiers.
Alter the order of the segments and separators to match different formats.
const regexp = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
Chunk string into n-size chunks
Use the .{1,n} quantifier to match any character between 1 and n times.
Add the global flag (g) to match all occurrences of the pattern in the string.
const regexp = /.{1,2}/g;
// Where '2' is the number of characters per chunk


Regular Expressions Cheat Sheet

Anchors
^: start of the string or the start of a line in a multiline pattern
$: end of the string or the end of a line in a multiline pattern
\b: word boundary
\B: not word boundary (opposite of \b)
💬  Note
Anchors are non-quantifiable (i.e. cannot be followed by a quantifier).

Character sequences
.: any character except line breaks
\w: any word character
\W: any non-word character (opposite of \w)
\s: any whitespace character
\S: any non-whitespace character (opposite of \s)
\d: any digit character
\D: any non-digit character (opposite of \d)
[abc]: a single character in the given set (here a, b or c)
[^abc]: a single character not in the given set (opposite of [abc])
[a-z]: a single character in the given range (here between a and z inclusive)
[^a-z]: a single character not in the given range (opposite of [a-z])
[a-zA-Z]: a single character in either of the given ranges
💡  Tip
Use \ to escape special characters (e.g. \, /, [, ], (, ), {, } etc.).

Quantifiers
a?: zero or one of a (equal to a{0,1})
a*: zero or more of a (equal to a{0,})
a+: one or more of a (equal to a{1,})
a{3}: exactly 3 of a
a{3,}: 3 or more of a
a{3,5}: between 3 and 5 of a (inclusive)
💬  Note
a is any valid quantifiable expression.

Groups
(ab): match and capture everything enclosed (here exactly ab)
(a|b): match and capture either one character (here a or b)
(?:ab): match everything enclosed, without capturing
Flags
g: Global
m: Multiline
i: Case insensitive
u: Unicode
Note that this cheatsheet is meant only as a starting point and is by no means a complete guide to all the features and nuances of regular expressions. You can also read 6 JavaScript Regular Expression features you can use today for a deeper dive into some more advanced features.



Regular expressions, while very powerful, are notoriously hard to master. Here are 6 useful features that can help you start using them in your JavaScript projects:

Capturing groups
Capturing groups allow you to get specific parts of the matched string, simply by wrapping part of the regular expression in parentheses (...):

const str = 'JavaScript is a programming language';
/(JavaScript) is a (.*)/.exec(str);
/*
  [
    0: 'JavaScript is a programming language',
    1: 'JavaScript',
    2: 'programming language'
  ]
*/
Non-capturing groups
Non-capturing groups are used for matching something without capturing it, like an either/or matching group that you do not really need. They are defined similarly to capturing groups, but prefixed with ?::

const str = 'JavaScript is a programming language';
/(?:JavaScript|Python) is a (.+)/.exec(str);
/*
  [
    0: 'JavaScript is a programming language',
    1: 'programming language'
  ]
*/
Named capturing groups
Named capturing groups allow you to name a capturing group, by prefixing it with <name>:

const str = 'JavaScript is a programming language';
/(?<subject>.+) is a (?<description>.+)/.exec(str);
/*
  [
    0: 'JavaScript is a programming language',
    1: 'JavaScript',
    2: 'programming language',
    groups: {
      subject: 'JavaScript,
      description: 'programming language'
    }
  ]
*/
Capturing group backreferences
Backreferences help you write shorter regular expressions, by repeating an existing capturing group, using \1, \2 etc. Similarly, you can also repeat named capturing groups using \k<name>:

const str = 'JavaScript is a programming language - an awesome programming language JavaScript is';
/(.+) is a (?<description>.+) - an awesome \k<description> \1 is/.exec(str);
/*
  [
    0: 'JavaScript is a programming language - an awesome programming language JavaScript is',
    1: 'JavaScript',
    2: 'programming language',
    groups: {
      subject: 'JavaScript,
      description: 'programming language'
    }
  ]
*/
Lookaheads
Lookaheads allow you to check if something is followed by a certain pattern, without actually matching it. You can create positive lookaheads using ?= and negative lookaheads using ?!:

const str = 'JavaScript is not the same as Java and you should remember that';
/Java(?=Script)(.*)/.exec(str);
/*
  [
    0: 'JavaScript is not the same as Java and you should remember that',
    1: 'Script is not the same as Java and you should remember that'
  ]
*/

/Java(?!Script)(.*)/.exec(str);
/*
  [
    0: 'Java and you should remember that',
    1: ' and you should remember that'
  ]
*/
Unicode characters
Finally, you can match unicode characters, using /p{...} and the /u flag. Examples include, but are not limited to {Emoji}, {Math_Symbols} and {Script=Greek}:

const str = 'Greek looks like this: γεια';
/\p{Script=Greek}+/u.exec(str);
/*
  [
    0: 'γεια'
  ]
*/

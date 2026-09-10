# JavaScript Problem Solutions

Fresh, runnable solutions for every problem in `Javascript/13. Problems/`.

**305 files** covering **325 source `.md` files** — near-duplicate problems are merged into a single file.

## Conventions

Each file contains:

- a JSDoc header stating the problem, the approach, and time/space complexity
- one clear primary solution, plus useful alternatives and closely related variants
- runnable `// ---- Examples ----` at the bottom (`node <file>` prints them)
- `module.exports` so functions can be imported and tested

```bash
node 'array/two-sum.js'          # run the examples
node -e "console.log(require('./array/max-subarray.js').maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]))"
```

## Contents

### Root — closures, currying, DOM, validation, polyfills

- [`allPrimesfromToN.js`](allPrimesfromToN.js) — All primes from 1 to N.
- [`async-await-with-foreach-loop.js`](async-await-with-foreach-loop.js) — async/await with a forEach loop.
- [`calculator.js`](calculator.js) — Calculator object.
- [`capitaliseAllWords.js`](capitaliseAllWords.js) — Capitalise every word in a string.
- [`checkPasswordStrength.js`](checkPasswordStrength.js) — Check password strength.
- [`convert-a-negative-number-to-positive.js`](convert-a-negative-number-to-positive.js) — Convert a negative number to positive.
- [`filter-out-odd-numbers-and-square.js`](filter-out-odd-numbers-and-square.js) — Filter out odd numbers and square the rest.
- [`find-most-frequent-word-in-paragraph.js`](find-most-frequent-word-in-paragraph.js) — Find the most frequent word in a paragraph.
- [`find-two-numbers-that-sum-up-to-0.js`](find-two-numbers-that-sum-up-to-0.js) — Find two numbers that sum up to 0.
- [`findElementsByStyle.js`](findElementsByStyle.js) — Find DOM elements by computed style.
- [`format-license-key.js`](format-license-key.js) — Format a license key.
- [`getDomain.js`](getDomain.js) — Get the domain from a URL.
- [`getElementByClassName.js`](getElementByClassName.js) — Implement getElementsByClassName.
- [`getRandomColor.js`](getRandomColor.js) — Generate a random color.
- [`getTimeLeft.js`](getTimeLeft.js) — getTimeLeft — humanised "X years and Y months" string.
- [`implement_counter.js`](implement_counter.js) — Implement count().
- [`implement_undefinedToNull.js`](implement_undefinedToNull.js) — undefinedToNull()
- [`infinite-currying-for-addition.js`](infinite-currying-for-addition.js) — Infinite currying for addition.
- [`longest-repeated-subsequence.js`](longest-repeated-subsequence.js) — Longest Repeated Subsequence (LRS).
- [`polyfills.js`](polyfills.js) — Core JavaScript polyfills.
- [`print-the-chess-board-pattern.js`](print-the-chess-board-pattern.js) — Print the chess board pattern.
- [`read-a-field-inside-a-nested-object.js`](read-a-field-inside-a-nested-object.js) — Read a field inside a nested object.
- [`restrict-callback-to-at-most-n-times.js`](restrict-callback-to-at-most-n-times.js) — Implement a function that accepts a callback and restricts its invocation
- [`reverse-last-k-elements-in-a-queue.js`](reverse-last-k-elements-in-a-queue.js) — Reverse the last K elements of a queue.
- [`safely-access-deeply-nested-properties.js`](safely-access-deeply-nested-properties.js) — Safely access deeply-nested properties in JavaScript objects.
- [`twoSum.js`](twoSum.js) — Two Sum (LeetCode 1).
- [`validateEmailAddress.js`](validateEmailAddress.js) — Validate an email address.
- [`validatePasswords.js`](validatePasswords.js) — Validate passwords.

### number/ — numeric conversion, randomness, formatting

- [`add-float-numbers.js`](number/add-float-numbers.js) — Add floating point numbers accurately.
- [`add-two-binary-numbers.js`](number/add-two-binary-numbers.js) — Add two binary numbers given as strings.
- [`armstrong.js`](number/armstrong.js) — Armstrong (narcissistic) number.
- [`binary-representation-of-next-number.js`](number/binary-representation-of-next-number.js) — Binary representation of the next number.
- [`chainableAdd.js`](number/chainableAdd.js) — Chainable add.
- [`convert-decimal-to-binary.js`](number/convert-decimal-to-binary.js) — Convert a decimal number to binary.
- [`convert-float-decimal-to-octal.js`](number/convert-float-decimal-to-octal.js) — Convert a floating point decimal number to octal.
- [`convert-integer-array-to-string-array.js`](number/convert-integer-array-to-string-array.js) — Convert an array of integers to an array of strings.
- [`generate-a-n-digit-number.js`](number/generate-a-n-digit-number.js) — Generate a random N-digit number.
- [`integer-is-positive-negative-or-zero.js`](number/integer-is-positive-negative-or-zero.js) — Check whether an integer is positive, negative or zero.
- [`integerToRoman.js`](number/integerToRoman.js) — Integer to Roman numeral (LeetCode 12), and back.
- [`parse-float-with-two-decimal-places.js`](number/parse-float-with-two-decimal-places.js) — Parse a float with two decimal places.
- [`random-number-in-given-range.js`](number/random-number-in-given-range.js) — Random number in a given range.
- [`random.js`](number/random.js) — Random helpers.
- [`random_color.js`](number/random_color.js) — Random color generators.

### object/ — object transforms, deep access, serialization

- [`call-map-only-if-element-is-an-array.js`](object/call-map-only-if-element-is-an-array.js) — Call the map method only if the element is an array.
- [`camelise-object.js`](object/camelise-object.js) — Camelise an object.
- [`change-values-in-an-array-when-doing-foreach.js`](object/change-values-in-an-array-when-doing-foreach.js) — Change values in an array while iterating with forEach.
- [`compare-two-objects-for-equivalent-property-values.js`](object/compare-two-objects-for-equivalent-property-values.js) — Determine whether the first object contains equivalent property values
- [`count-substring-occurrences-in-a-string.js`](object/count-substring-occurrences-in-a-string.js) — Count the number of times a substring occurs in a string.
- [`custom-string-tokenizer.js`](object/custom-string-tokenizer.js) — Custom string tokenizer.
- [`get-a-key-in-an-object-by-its-value.js`](object/get-a-key-in-an-object-by-its-value.js) — Get a key in a JavaScript object by its value.
- [`getCreditCardProvider.js`](object/getCreditCardProvider.js) — Detect a credit card provider from its number.
- [`group-objects-by-a-common-property.js`](object/group-objects-by-a-common-property.js) — Group objects in an array by a common property.
- [`omit.js`](object/omit.js) — omit() and pick().
- [`set-object-value-at-the-string-path.js`](object/set-object-value-at-the-string-path.js) — Set an object value at a string path.
- [`sort-an-object-array-by-date.js`](object/sort-an-object-array-by-date.js) — Sort an array of objects by date.
- [`stringify.js`](object/stringify.js) — Implement JSON.stringify.

### string/ — parsing, formatting, pattern matching

- [`capitalizeWord.js`](string/capitalizeWord.js) — Capitalize words.
- [`check-if-a-string-is-a-valid-url.js`](string/check-if-a-string-is-a-valid-url.js) — Check whether a string contains a valid URL format.
- [`check-string-contains-uppercase-lowercase-special-and-numeric.js`](string/check-string-contains-uppercase-lowercase-special-and-numeric.js) — Check whether a string contains uppercase, lowercase, special characters
- [`check-string-formed-by-circular-clockwise-shifts.js`](string/check-string-formed-by-circular-clockwise-shifts.js) — Check if a string can be formed from another by at most X circular
- [`check-two-strings-are-isomorphic.js`](string/check-two-strings-are-isomorphic.js) — Check whether two strings are isomorphic (LeetCode 205).
- [`circularly-shift-characters-by-their-frequencies.js`](string/circularly-shift-characters-by-their-frequencies.js) — Modify a string by circularly shifting each character to the right by its
- [`convert-string-to-24-hour-time.js`](string/convert-string-to-24-hour-time.js) — Convert a 12-hour time string to 24-hour format.
- [`convert-strings-into-t-by-replacing-characters.js`](string/convert-strings-into-t-by-replacing-characters.js) — Convert given strings into T by replacing characters between strings any
- [`convertToSlug.js`](string/convertToSlug.js) — Convert a string to a URL slug.
- [`count-occurrences-of-a-specific-character.js`](string/count-occurrences-of-a-specific-character.js) — Count the occurrences of a specific character in a string.
- [`count-occurrences-of-all-items-in-an-array.js`](string/count-occurrences-of-all-items-in-an-array.js) — Count occurrences of all items in an array.
- [`count-palindromic-strings-by-swapping-a-pair.js`](string/count-palindromic-strings-by-swapping-a-pair.js) — Count palindromic strings possible by swapping a pair of characters.
- [`extract-first-word-from-a-string.js`](string/extract-first-word-from-a-string.js) — Extract the first word from a string.
- [`find-all-strings-that-match-specific-pattern-in-a-dictionary.js`](string/find-all-strings-that-match-specific-pattern-in-a-dictionary.js) — Find all strings in a dictionary that match a specific pattern.
- [`find-kth-non-repeating-character.js`](string/find-kth-non-repeating-character.js) — Find the Kth non-repeating character in a string.
- [`find-length-of-longest-balanced-subsequence.js`](string/find-length-of-longest-balanced-subsequence.js) — Find the length of the longest balanced subsequence of brackets.
- [`find-smallest-string-that-can-generate-all-given-strings.js`](string/find-smallest-string-that-can-generate-all-given-strings.js) — Find the smallest string whose characters can generate all given strings.
- [`findIndexOf.js`](string/findIndexOf.js) — Implement indexOf.
- [`generate-all-combinations-of-a-string.js`](string/generate-all-combinations-of-a-string.js) — Generate all combinations / permutations of a string.
- [`get-character-array-from-string.js`](string/get-character-array-from-string.js) — Get a character array from a string.
- [`get-the-last-character-of-a-string.js`](string/get-the-last-character-of-a-string.js) — Get the last character of a string.
- [`get-value-of-a-string-after-last-slash.js`](string/get-value-of-a-string-after-last-slash.js) — Get the value of a string after the last slash.
- [`getInitials.js`](string/getInitials.js) — Get the initials of a name.
- [`globally-replace-a-forward-slash.js`](string/globally-replace-a-forward-slash.js) — Globally replace a forward slash in a string.
- [`last-n-characters-of-a-string.js`](string/last-n-characters-of-a-string.js) — Get the last N characters of a string.
- [`lexicographically-next-string.js`](string/lexicographically-next-string.js) — Find the lexicographically next string in dictionary order.
- [`longest-string-in-an-array.js`](string/longest-string-in-an-array.js) — Find the longest string in an array.
- [`mirror-characters-of-a-string.js`](string/mirror-characters-of-a-string.js) — Mirror the characters of a string.
- [`nonRepeatingFirstCharacter.js`](string/nonRepeatingFirstCharacter.js) — First non-repeating character in a string.
- [`random-password.js`](string/random-password.js) — Generate a random password.
- [`remove-first-and-last-characters-from-a-string.js`](string/remove-first-and-last-characters-from-a-string.js) — Remove the first and last characters from a string.
- [`remove-last-character-from-the-string.js`](string/remove-last-character-from-the-string.js) — Remove the last character from a string.
- [`remove-portion-of-a-string-after-a-certain-character.js`](string/remove-portion-of-a-string-after-a-certain-character.js) — Remove the portion of a string after a certain character.
- [`remove-punctuation-from-text.js`](string/remove-punctuation-from-text.js) — Remove punctuation from text.
- [`removeDuplicate.js`](string/removeDuplicate.js) — Remove duplicate characters from a string (and duplicates from arrays).
- [`replace-all-occurrences-of-a-string.js`](string/replace-all-occurrences-of-a-string.js) — Replace all occurrences of a substring.
- [`replace-characters-by-distance-equal-to-frequency.js`](string/replace-characters-by-distance-equal-to-frequency.js) — Modify a string by replacing characters with the alphabet whose distance
- [`replace-multiple-spaces-with-single-space.js`](string/replace-multiple-spaces-with-single-space.js) — Replace multiple spaces with a single space.
- [`reverse-words-in-a-statement.js`](string/reverse-words-in-a-statement.js) — Reverse the words in a statement and remove extra whitespace.
- [`shortest-common-supersequence.js`](string/shortest-common-supersequence.js) — Shortest Common Supersequence (SCS).
- [`sortStrings.js`](string/sortStrings.js) — Sort strings.
- [`string-to-jadencase.js`](string/string-to-jadencase.js) — String to Jaden Case.
- [`stringReverse.js`](string/stringReverse.js) — Reverse a string.
- [`truncate-a-string-and-add-ellipsis.js`](string/truncate-a-string-and-add-ellipsis.js) — Truncate a string to a certain length and add an ellipsis.

### array/ — arrays, matrices, trees, linked lists, DP

- [`3sum-closest.js`](array/3sum-closest.js) — 3Sum Closest (LeetCode 16).
- [`absolute-difference-between-diagonals-of-matrix.js`](array/absolute-difference-between-diagonals-of-matrix.js) — Absolute difference between the diagonals of a square matrix.
- [`array-includes-value.js`](array/array-includes-value.js) — Check whether an array includes a value.
- [`array-min-max.js`](array/array-min-max.js) — Find the minimum and maximum of an array.
- [`array-of-given-size.js`](array/array-of-given-size.js) — Create an array of a given size.
- [`array-or-string-permutations.js`](array/array-or-string-permutations.js) — Generate all permutations of an array or string.
- [`array-right-rotated-k-times.js`](array/array-right-rotated-k-times.js) — Rotate an array right by k positions.
- [`array-rotation.js`](array/array-rotation.js) — Array rotation.
- [`array-sum-using-bitwise-or-after-k-circular-shifts.js`](array/array-sum-using-bitwise-or-after-k-circular-shifts.js) — Find the array sum using bitwise OR after splitting the array into two
- [`backspace-string-compare.js`](array/backspace-string-compare.js) — Check whether two strings are equal when '#' means backspace
- [`balanced-parentheses.js`](array/balanced-parentheses.js) — Balanced parentheses (LeetCode 20).
- [`bifurcate-array-split.js`](array/bifurcate-array-split.js) — Bifurcate an array — split it into two groups.
- [`binary-tree-is-symmetric.js`](array/binary-tree-is-symmetric.js) — Check whether a binary tree is symmetric (LeetCode 101).
- [`bottom-view-of-a-binary-tree.js`](array/bottom-view-of-a-binary-tree.js) — Bottom view of a binary tree.
- [`check-if-binary-tree-has-path-sum.js`](array/check-if-binary-tree-has-path-sum.js) — Path Sum (LeetCode 112 / 113 / 437).
- [`check-if-matrix-is-upper-triangular.js`](array/check-if-matrix-is-upper-triangular.js) — Check whether a matrix is upper triangular.
- [`check-if-string-has-duplicate-letters.js`](array/check-if-string-has-duplicate-letters.js) — Check whether a string has duplicate letters.
- [`check-if-two-stacks-are-equal.js`](array/check-if-two-stacks-are-equal.js) — Check whether two stacks are equal.
- [`check-number-can-be-expressed-as-sum-of-consecutive-numbers.js`](array/check-number-can-be-expressed-as-sum-of-consecutive-numbers.js) — Can a number be expressed as the sum of two or more consecutive positive
- [`common-elements-in-arrays.js`](array/common-elements-in-arrays.js) — Find the common elements of two or more arrays (intersection).
- [`comparing-arrays-with-relational-operators.js`](array/comparing-arrays-with-relational-operators.js) — Comparing arrays with > and < in JavaScript.
- [`convert-a-number-into-array.js`](array/convert-a-number-into-array.js) — Convert a number into an array of its digits.
- [`convert-array-of-objects-to-csv.js`](array/convert-array-of-objects-to-csv.js) — Convert an array of objects to a CSV string containing only the specified
- [`convert-long-number-into-abbreviated-string.js`](array/convert-long-number-into-abbreviated-string.js) — Convert a long number into an abbreviated string.
- [`count-distinct-occurrences-as-a-subsequence.js`](array/count-distinct-occurrences-as-a-subsequence.js) — Count distinct occurrences of a pattern as a subsequence (LeetCode 115).
- [`count-grouped-elements.js`](array/count-grouped-elements.js) — Count grouped elements.
- [`count-inversions.js`](array/count-inversions.js) — Count inversions in an array.
- [`count-numbers-not-expressible-as-sum-of-consecutive-integers.js`](array/count-numbers-not-expressible-as-sum-of-consecutive-integers.js) — Count numbers up to N that CANNOT be expressed as the sum of at least two
- [`count-occurrences.js`](array/count-occurrences.js) — Count occurrences of a value in an array.
- [`count-pairs-both-even-both-odd-or-sum-k.js`](array/count-pairs-both-even-both-odd-or-sum-k.js) — Count pairs (i < j) that are both even, both odd, or whose sum is
- [`count-rotations-required-to-sort-array-in-non-increasing-order.js`](array/count-rotations-required-to-sort-array-in-non-increasing-order.js) — Count the rotations required to sort an array in non-increasing order.
- [`count-subsets-with-sum-equal-to-x.js`](array/count-subsets-with-sum-equal-to-x.js) — Count subsets with sum equal to X.
- [`count-ways-to-split-array-into-two-subsets-with-difference-k.js`](array/count-ways-to-split-array-into-two-subsets-with-difference-k.js) — Count the ways to split an array into two subsets whose sums differ by k.
- [`create-an-array-of-objects-from-multiple-arrays.js`](array/create-an-array-of-objects-from-multiple-arrays.js) — Create an array of objects from multiple parallel arrays.
- [`delete-first-element-without-shift.js`](array/delete-first-element-without-shift.js) — Delete the first element of an array without using shift().
- [`delete-middle-element-from-an-array.js`](array/delete-middle-element-from-an-array.js) — Delete the middle element from an array.
- [`diagonally-dominant-matrix.js`](array/diagonally-dominant-matrix.js) — Diagonally dominant matrix.
- [`digitalRoot.js`](array/digitalRoot.js) — Digital root.
- [`divide-a-number-into-two-parts-with-maximum-digit-sum.js`](array/divide-a-number-into-two-parts-with-maximum-digit-sum.js) — Divide a number into two parts such that the sum of their digit sums is
- [`divide-array-into-two-subsets-maximising-sum-of-squares.js`](array/divide-array-into-two-subsets-maximising-sum-of-squares.js) — Divide an array into two subsets such that the sum of the squares of the
- [`doubly-linked-list.js`](array/doubly-linked-list.js) — Doubly Linked List.
- [`drop-elements-until-predicate-is-true.js`](array/drop-elements-until-predicate-is-true.js) — Remove elements from the start of an array until the passed function
- [`elements-of-one-array-not-present-in-another.js`](array/elements-of-one-array-not-present-in-another.js) — Elements of one array that are not present in another.
- [`equally-divide-into-two-sets-with-maximum-distinct-elements.js`](array/equally-divide-into-two-sets-with-maximum-distinct-elements.js) — Equally divide an array into two sets such that one set has the maximum
- [`filter-array-based-on-key-and-value.js`](array/filter-array-based-on-key-and-value.js) — Filter an array of objects based on a key and value.
- [`find-all-autobiographical-numbers.js`](array/find-all-autobiographical-numbers.js) — Find all autobiographical (self-descriptive) numbers with a given number
- [`find-all-unique-paths-in-a-grid.js`](array/find-all-unique-paths-in-a-grid.js) — Unique paths in a grid (LeetCode 62 / 63).
- [`find-distinct-subset-sums.js`](array/find-distinct-subset-sums.js) — Find all distinct subset (subsequence) sums of an array.
- [`find-distinct-ways-to-climb-the-stairs.js`](array/find-distinct-ways-to-climb-the-stairs.js) — Climbing stairs (LeetCode 70) and its variants.
- [`find-duplicate-elements-in-an-array.js`](array/find-duplicate-elements-in-an-array.js) — Find duplicate elements in an array.
- [`find-element-at-given-index-after-rotations.js`](array/find-element-at-given-index-after-rotations.js) — Find the element at a given index after a number of range rotations.
- [`find-element-with-k-frequency.js`](array/find-element-with-k-frequency.js) — Find the element that occurs exactly k times in an array.
- [`find-first-or-last-occurrence-in-sorted-array.js`](array/find-first-or-last-occurrence-in-sorted-array.js) — Find the first or last occurrence of a number in a sorted array.
- [`find-height-and-width-of-binary-tree.js`](array/find-height-and-width-of-binary-tree.js) — Find the height and the maximum width of a binary tree.
- [`find-index-in-a-json-object-by-value.js`](array/find-index-in-a-json-object-by-value.js) — Find the index of an object in an array by one of its values.
- [`find-inorder-predecessor-in-bst.js`](array/find-inorder-predecessor-in-bst.js) — Find the inorder predecessor (and successor) of a key in a BST.
- [`find-insert-position-in-sorted-array.js`](array/find-insert-position-in-sorted-array.js) — Find the correct position to insert an element into a sorted array
- [`find-k-most-frequent-elements.js`](array/find-k-most-frequent-elements.js) — Top K Frequent Elements (LeetCode 347).
- [`find-maximum-number-of-pieces-in-n-cuts.js`](array/find-maximum-number-of-pieces-in-n-cuts.js) — Maximum number of pieces from n cuts.
- [`find-minimum-rotations-to-get-the-same-string.js`](array/find-minimum-rotations-to-get-the-same-string.js) — Find the minimum number of rotations required to get the same string.
- [`find-missing-characters-to-make-a-pangram.js`](array/find-missing-characters-to-make-a-pangram.js) — Find the missing characters needed to make a string a pangram.
- [`find-nearest-power-of-2.js`](array/find-nearest-power-of-2.js) — Find the nearest power of 2 for every array element.
- [`find-next-smaller-element.js`](array/find-next-smaller-element.js) — Find the Next Smaller Element for every position.
- [`find-non-duplicate-number-in-an-array.js`](array/find-non-duplicate-number-in-an-array.js) — Find the number that appears once when every other number appears twice
- [`find-number-whose-digit-sum-equals-n.js`](array/find-number-whose-digit-sum-equals-n.js) — Find the smallest number X whose digits sum to N.
- [`find-object-by-id-in-an-array-of-objects.js`](array/find-object-by-id-in-an-array-of-objects.js) — Find an object by id in an array of objects.
- [`find-second-largest-element-in-an-array.js`](array/find-second-largest-element-in-an-array.js) — Find the second largest element in an array.
- [`find-second-most-repeated-word.js`](array/find-second-most-repeated-word.js) — Find the second most repeated word in a sequence.
- [`find-smallest-value-not-representable-as-subset-sum.js`](array/find-smallest-value-not-representable-as-subset-sum.js) — Find the smallest positive value that cannot be represented as the sum of
- [`find-square-without-multiplication-or-pow.js`](array/find-square-without-multiplication-or-pow.js) — Find the square of a number without using * or Math.pow.
- [`find-the-largest-divisor-subset.js`](array/find-the-largest-divisor-subset.js) — Largest Divisible Subset (LeetCode 368).
- [`find-the-longest-common-prefix.js`](array/find-the-longest-common-prefix.js) — Longest Common Prefix (LeetCode 14).
- [`find-the-missing-number.js`](array/find-the-missing-number.js) — Find the missing number in an array of 1..n (or 0..n).
- [`find-the-person-who-will-finish-last.js`](array/find-the-person-who-will-finish-last.js) — Find the person who will finish last.
- [`first-n-elements-from-an-array.js`](array/first-n-elements-from-an-array.js) — Get the first n elements of an array (and the last n).
- [`first-non-null-undefined-argument.js`](array/first-non-null-undefined-argument.js) — Return the first argument that is neither null nor undefined.
- [`firstNonRepeatCharacter.js`](array/firstNonRepeatCharacter.js) — First non-repeating character.
- [`flatten-binary-tree-to-linked-list.js`](array/flatten-binary-tree-to-linked-list.js) — Flatten a binary tree to a linked list (LeetCode 114).
- [`format-a-phone-number.js`](array/format-a-phone-number.js) — Format a phone number into a human-readable form.
- [`four-sum-quadruplets.js`](array/four-sum-quadruplets.js) — Print all the quadruplets with a given 4-sum (LeetCode 18).
- [`function-that-accepts-array-and-condition-returns-boolean.js`](array/function-that-accepts-array-and-condition-returns-boolean.js) — Implement a function that accepts an array and a condition, and returns
- [`generate-k-digit-numbers-with-strictly-increasing-digits.js`](array/generate-k-digit-numbers-with-strictly-increasing-digits.js) — Generate all k-digit numbers whose digits are in strictly increasing
- [`generate-matrix-with-perfect-square-secondary-diagonal.js`](array/generate-matrix-with-perfect-square-secondary-diagonal.js) — Generate an N x N matrix whose secondary diagonal sums to a perfect
- [`generateOTP.js`](array/generateOTP.js) — Generate a one-time password (OTP).
- [`get-character-at-specific-position.js`](array/get-character-at-specific-position.js) — Get the character at a specific position in a string.
- [`get-the-last-item-of-an-object.js`](array/get-the-last-item-of-an-object.js) — Get the last item of a JavaScript object.
- [`haveSameContents.js`](array/haveSameContents.js) — Check whether two arrays have the same contents.
- [`hilbert-matrix.js`](array/hilbert-matrix.js) — Hilbert matrix.
- [`intersection-and-not-common-elements.js`](array/intersection-and-not-common-elements.js) — Intersection and the "not common" elements of two arrays.
- [`invert-a-binary-tree.js`](array/invert-a-binary-tree.js) — Invert a binary tree (LeetCode 226) — recursive and iterative.
- [`involutory-matrix.js`](array/involutory-matrix.js) — Involutory Matrix.
- [`iterate-over-a-callback-n-times.js`](array/iterate-over-a-callback-n-times.js) — Iterate over a callback n times.
- [`k-nearest-neighbors.js`](array/k-nearest-neighbors.js) — K Nearest Neighbors (KNN).
- [`kronecker-product-of-two-matrices.js`](array/kronecker-product-of-two-matrices.js) — Kronecker product of two matrices.
- [`kth-element-in-spiral-form-of-matrix.js`](array/kth-element-in-spiral-form-of-matrix.js) — Find the Kth element in the spiral traversal of a matrix.
- [`kth-largest-sum-contiguous-subarray.js`](array/kth-largest-sum-contiguous-subarray.js) — Kth largest sum of a contiguous subarray.
- [`largest-elements-from-array.js`](array/largest-elements-from-array.js) — Get the n largest elements from an array.
- [`largest-number-by-changing-at-most-k-digits.js`](array/largest-number-by-changing-at-most-k-digits.js) — Find the largest number that can be formed by changing at most k digits.
- [`largest-sum-contiguous-increasing-subarray.js`](array/largest-sum-contiguous-increasing-subarray.js) — Largest sum of a contiguous INCREASING subarray.
- [`largest-three-elements-in-an-array.js`](array/largest-three-elements-in-an-array.js) — Find the three largest elements in an array.
- [`last-duplicate-element-in-a-sorted-array.js`](array/last-duplicate-element-in-a-sorted-array.js) — Last duplicate element in a sorted array.
- [`lcm.js`](array/lcm.js) — Least Common Multiple (LCM) and Greatest Common Divisor (GCD).
- [`leapYear.js`](array/leapYear.js) — Leap year.
- [`left-view-of-a-binary-tree.js`](array/left-view-of-a-binary-tree.js) — Left view of a binary tree.
- [`length-of-an-associative-array.js`](array/length-of-an-associative-array.js) — Length of an "associative array" (a plain object).
- [`linked-list-nodes-less-than-k.js`](array/linked-list-nodes-less-than-k.js) — Sum and product of all the nodes in a linked list whose values are less
- [`longest-array-element.js`](array/longest-array-element.js) — Find the longest element in an array.
- [`longest-palindrome.js`](array/longest-palindrome.js) — Longest palindrome problems.
- [`loop-through-a-plain-object.js`](array/loop-through-a-plain-object.js) — Loop through a plain object whose members are objects.
- [`markov-matrix.js`](array/markov-matrix.js) — Markov (stochastic) matrix.
- [`matrix-in-spiral-form.js`](array/matrix-in-spiral-form.js) — Print a 2-D matrix in spiral form (LeetCode 54).
- [`matrix-in-zigzag-format.js`](array/matrix-in-zigzag-format.js) — Print a matrix in zigzag (boustrophedon) format.
- [`matrix-reverse-spiral-form.js`](array/matrix-reverse-spiral-form.js) — Print a matrix in reverse spiral form.
- [`matrix-z-form.js`](array/matrix-z-form.js) — Print a matrix in Z form.
- [`max-min-value-of-an-attribute-in-array-of-objects.js`](array/max-min-value-of-an-attribute-in-array-of-objects.js) — Find the maximum and minimum value of an attribute in an array of objects.
- [`max-subarray.js`](array/max-subarray.js) — Maximum Subarray (LeetCode 53) — Kadane's algorithm.
- [`maximizing-stock-profit-with-cooldown.js`](array/maximizing-stock-profit-with-cooldown.js) — Best Time to Buy and Sell Stock with Cooldown (LeetCode 309).
- [`maximum-product-subarray.js`](array/maximum-product-subarray.js) — Maximum Product Subarray (LeetCode 152).
- [`maximum-subsets-with-product-of-minimums-at-least-k.js`](array/maximum-subsets-with-product-of-minimums-at-least-k.js) — Maximum number of subsets an array can be split into such that, for each
- [`maximum-sum-two-non-overlapping-subarrays.js`](array/maximum-sum-two-non-overlapping-subarrays.js) — Maximum sum of two non-overlapping subarrays of given sizes
- [`merge-two-arrays-and-remove-duplicates.js`](array/merge-two-arrays-and-remove-duplicates.js) — Merge two arrays and remove duplicate items.
- [`merge-two-sorted-arrays.js`](array/merge-two-sorted-arrays.js) — Merge two sorted arrays into a single sorted array.
- [`min-flips-to-make-all-characters-same.js`](array/min-flips-to-make-all-characters-same.js) — Minimum flips of continuous characters to make all characters the same.
- [`minimize-cost-to-convert-characters-case.js`](array/minimize-cost-to-convert-characters-case.js) — Minimize the cost of converting all occurrences of each distinct
- [`minimize-operations-to-make-arrays-equal.js`](array/minimize-operations-to-make-arrays-equal.js) — Minimize operations to make both arrays equal by decrementing a value
- [`minimum-cost-to-buy-all-items-at-least-once.js`](array/minimum-cost-to-buy-all-items-at-least-once.js) — Minimum cost to buy all items at least once.
- [`minimum-operations-for-adjacent-pairing.js`](array/minimum-operations-for-adjacent-pairing.js) — Minimum operations for adjacent e / e+1 pairing.
- [`minimum-steps-to-convert-x-to-y.js`](array/minimum-steps-to-convert-x-to-y.js) — Minimum steps to convert X to Y by repeated multiplication and division.
- [`minimum-sum-by-choosing-minimum-pairs.js`](array/minimum-sum-by-choosing-minimum-pairs.js) — Minimum sum by repeatedly choosing the minimum of pairs.
- [`mostCommon.js`](array/mostCommon.js) — Most common element(s) in an array.
- [`mostFrequent.js`](array/mostFrequent.js) — Most frequent element, character or word.
- [`n-elements-from-array-start-or-end.js`](array/n-elements-from-array-start-or-end.js) — Take n elements from the start or the end of an array.
- [`next-greater-element-in-the-array.js`](array/next-greater-element-in-the-array.js) — Next Greater Element.
- [`nth-array-element.js`](array/nth-array-element.js) — Get the nth element of an array.
- [`nth-occurrence-of-a-string.js`](array/nth-occurrence-of-a-string.js) — Find the nth occurrence of a substring in a string.
- [`number-expressed-as-sum-of-five-consecutive-integers.js`](array/number-expressed-as-sum-of-five-consecutive-integers.js) — Check whether a number can be expressed as the sum of five consecutive
- [`number-is-prime-or-not.js`](array/number-is-prime-or-not.js) — Check whether a number is prime.
- [`number-of-subarrays-with-sum-k.js`](array/number-of-subarrays-with-sum-k.js) — Number of subarrays with sum exactly K (LeetCode 560).
- [`number-of-vowels-in-a-string.js`](array/number-of-vowels-in-a-string.js) — Count the vowels in a string.
- [`offset-array-elements.js`](array/offset-array-elements.js) — Offset the elements of an array.
- [`palindrome-linked-list.js`](array/palindrome-linked-list.js) — Palindrome Linked List (LeetCode 234).
- [`partition-array-into-two-subsets-with-equal-average.js`](array/partition-array-into-two-subsets-with-equal-average.js) — Partition an array of non-negative integers into two subsets whose
- [`perfect-sum-problem.js`](array/perfect-sum-problem.js) — Perfect Sum Problem.
- [`perfectSquare.js`](array/perfectSquare.js) — Perfect squares.
- [`prime-number.js`](array/prime-number.js) — Prime numbers.
- [`print-matrix-diagonally-in-spiral-form.js`](array/print-matrix-diagonally-in-spiral-form.js) — Print matrix elements diagonally, and diagonally in spiral form.
- [`print-matrix-in-l-pattern.js`](array/print-matrix-in-l-pattern.js) — Print a matrix in L pattern.
- [`print-patterns.js`](array/print-patterns.js) — Star and triangle patterns.
- [`produce.js`](array/produce.js) — produce() — immutable updates with a mutable draft, the pattern Immer
- [`product-of-every-subsequence-is-a-perfect-square.js`](array/product-of-every-subsequence-is-a-perfect-square.js) — Check whether the product of every subsequence of an array is a perfect
- [`productExceptSelf.js`](array/productExceptSelf.js) — Product of Array Except Self (LeetCode 238).
- [`range-of-numbers-and-characters.js`](array/range-of-numbers-and-characters.js) — Generate a range of numbers or characters.
- [`rearrange-array-even-positioned-greater-than-odd.js`](array/rearrange-array-even-positioned-greater-than-odd.js) — Rearrange an array so that even-positioned elements are greater than
- [`remove-a-property-from-an-object.js`](array/remove-a-property-from-an-object.js) — Remove a property from a JavaScript object.
- [`remove-all-occurrences-of-a-character.js`](array/remove-all-occurrences-of-a-character.js) — Remove all occurrences of a character from a string.
- [`remove-duplicate-elements-from-array.js`](array/remove-duplicate-elements-from-array.js) — Remove duplicate elements from an array.
- [`remove-elements-from-an-array.js`](array/remove-elements-from-an-array.js) — Remove elements from a JavaScript array.
- [`remove-empty-elements-from-an-array.js`](array/remove-empty-elements-from-an-array.js) — Remove empty elements from an array.
- [`remove-falsy-values-from-an-array.js`](array/remove-falsy-values-from-an-array.js) — Remove falsy values from an array.
- [`remove-n-elements-from-the-end.js`](array/remove-n-elements-from-the-end.js) — Remove n elements from the end of an array.
- [`remove-objects-from-associative-array.js`](array/remove-objects-from-associative-array.js) — Remove objects from an "associative array" (an object used as a map).
- [`remove-smallest-and-largest-elements.js`](array/remove-smallest-and-largest-elements.js) — Remove the smallest and largest elements from an array.
- [`removeValues.js`](array/removeValues.js) — Remove specific values from an array.
- [`reverse-a-doubly-linked-list.js`](array/reverse-a-doubly-linked-list.js) — Reverse a doubly linked list.
- [`reverse-array-in-groups-of-given-size.js`](array/reverse-array-in-groups-of-given-size.js) — Reverse an array in groups of a given size.
- [`right-view-of-a-binary-tree.js`](array/right-view-of-a-binary-tree.js) — Right view of a binary tree (LeetCode 199).
- [`rotate-matrix.js`](array/rotate-matrix.js) — Rotate a matrix: 90 degrees clockwise and anticlockwise, 180 degrees,
- [`rotate-odd-right-and-even-left.js`](array/rotate-odd-right-and-even-left.js) — Rotate all odd numbers right and all even numbers left in an array
- [`running-mean-at-every-point.js`](array/running-mean-at-every-point.js) — Find the mean at every point in an array (running / cumulative average).
- [`search-max-value-of-an-attribute.js`](array/search-max-value-of-an-attribute.js) — Search for the maximum value of an attribute in an array of objects.
- [`serialize-and-deserialize-binary-tree.js`](array/serialize-and-deserialize-binary-tree.js) — Serialize and deserialize a binary tree (LeetCode 297).
- [`set-matrix-zeroes.js`](array/set-matrix-zeroes.js) — Set Matrix Zeroes (LeetCode 73).
- [`singleOccurrence.js`](array/singleOccurrence.js) — Find elements with a single occurrence.
- [`sort-an-object-by-its-values.js`](array/sort-an-object-by-its-values.js) — Sort an "associative array" (an object) by its values.
- [`sort-array-of-objects-by-two-fields.js`](array/sort-array-of-objects-by-two-fields.js) — Sort an array of objects by two (or more) fields.
- [`sort-letters-in-a-string.js`](array/sort-letters-in-a-string.js) — Return a string with its letters in alphabetical order.
- [`sort-numeric-array.js`](array/sort-numeric-array.js) — Sort a numeric array.
- [`sort-order-of-keys-in-an-object.js`](array/sort-order-of-keys-in-an-object.js) — Control the order of keys in a JavaScript object.
- [`sortAscendingByDate.js`](array/sortAscendingByDate.js) — Sort an array by date, ascending.
- [`sortedIndex.js`](array/sortedIndex.js) — sortedIndex — the index at which a value should be inserted to keep an
- [`split-map-keys-and-values-into-arrays.js`](array/split-map-keys-and-values-into-arrays.js) — Split a Map's keys and values into separate arrays.
- [`splitArrayIntoChunks.js`](array/splitArrayIntoChunks.js) — Split an array into chunks.
- [`stack-with-min-and-max.js`](array/stack-with-min-and-max.js) — A stack with O(1) min() and max().
- [`subset-sum-problem.js`](array/subset-sum-problem.js) — Subset Sum Problem (where the array sum is at most N).
- [`subset-with-sum-closest-to-zero.js`](array/subset-with-sum-closest-to-zero.js) — Find the subset whose sum is closest to zero.
- [`subsets-with-even-product.js`](array/subsets-with-even-product.js) — Total number of subsets in which the product of the elements is EVEN.
- [`substrings-with-each-character-occurring-even-times.js`](array/substrings-with-each-character-occurring-even-times.js) — Number of substrings where each character occurs an EVEN number of times.
- [`sum-of-all-elements.js`](array/sum-of-all-elements.js) — Sum all the elements of an array.
- [`sum-of-elements-with-max-count-in-second-array.js`](array/sum-of-elements-with-max-count-in-second-array.js) — Sum of the elements of the first array such that the number of elements
- [`sum-of-subsets-nearest-to-k-from-two-arrays.js`](array/sum-of-subsets-nearest-to-k-from-two-arrays.js) — Sum of subsets nearest to K, formed from two given arrays.
- [`sum-of-subsets-of-all-subsets.js`](array/sum-of-subsets-of-all-subsets.js) — Sum of the subsets of all the subsets of an array.
- [`superset-and-subset-of-array.js`](array/superset-and-subset-of-array.js) — Superset and subset checks for arrays.
- [`swap-variables.js`](array/swap-variables.js) — Swap two variables.
- [`take-elements-by-condition.js`](array/take-elements-by-condition.js) — Take elements by condition from the start or the end of an array.
- [`top-view-of-a-binary-tree.js`](array/top-view-of-a-binary-tree.js) — Top view of a binary tree.
- [`truncate-array.js`](array/truncate-array.js) — Truncate an array to a given length.
- [`unique-two-digit-combinations.js`](array/unique-two-digit-combinations.js) — Print all the unique 2-digit combinations of given numbers.
- [`unique-values-from-multiple-arrays-using-set.js`](array/unique-values-from-multiple-arrays-using-set.js) — Create an array of unique values from multiple arrays using Set.
- [`unique-values-remove-duplicates.js`](array/unique-values-remove-duplicates.js) — Unique values in an array (remove duplicates).
- [`unzip-array-produced-by-zip.js`](array/unzip-array-produced-by-zip.js) — Ungroup (unzip) the elements of an array produced by zip.
- [`upper-hessenberg-matrix.js`](array/upper-hessenberg-matrix.js) — Upper Hessenberg matrix.
- [`valid-palindrome.js`](array/valid-palindrome.js) — Valid Palindrome (LeetCode 125) and its variants.

### array/twoSum/

- [`problem-statement.js`](array/twoSum/problem-statement.js) — Two Sum — problem statement and a small test harness.
- [`two-sum.js`](array/twoSum/two-sum.js) — Two Sum (LeetCode 1).

### array/AddTwoNumber/

- [`add-two-numbers.js`](array/AddTwoNumber/add-two-numbers.js) — Add Two Numbers (LeetCode 2).

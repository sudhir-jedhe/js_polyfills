/**
 * Count the vowels in a string.
 *
 * A Set lookup is O(1) per character; the regex version is shorter. Both
 * need a decision about 'y' and about accented vowels.
 */

const VOWELS = new Set('aeiouAEIOU');

/** Loop with a Set — fastest and easiest to extend. */
function countVowels(str) {
  let count = 0;
  for (const ch of String(str)) {
    if (VOWELS.has(ch)) count++;
  }
  return count;
}

/** Regex — shortest. */
const countVowelsRegex = (str) => (String(str).match(/[aeiou]/gi) || []).length;

/** Including accented vowels, via Unicode normalisation. */
const countVowelsUnicode = (str) =>
  (String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[aeiou]/gi) || []).length;

/** Counting 'y' as a vowel when it is not the first letter. */
function countVowelsWithY(str) {
  let count = 0;

  [...String(str)].forEach((ch, i) => {
    if (VOWELS.has(ch)) count++;
    else if ((ch === 'y' || ch === 'Y') && i > 0) count++;
  });

  return count;
}

/** How many of each vowel. */
function vowelBreakdown(str) {
  const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (const ch of String(str).toLowerCase()) {
    if (ch in counts) counts[ch]++;
  }

  return counts;
}

/** Consonants, the complement. */
const countConsonants = (str) => (String(str).match(/[b-df-hj-np-tv-z]/gi) || []).length;

/** The vowels themselves, in order. */
const vowelsIn = (str) => [...String(str)].filter((ch) => VOWELS.has(ch));

/** Remove all vowels. */
const removeVowels = (str) => String(str).replace(/[aeiou]/gi, '');

// ---- Examples ----
console.log(countVowels('Hello World'));      // 3
console.log(countVowelsRegex('JavaScript'));  // 3
console.log(countVowelsUnicode('café née'));  // 4
console.log(countVowelsWithY('rhythm'));      // 1
console.log(vowelBreakdown('education'));     // { a:1, e:1, i:1, o:1, u:1 }
console.log(countConsonants('Hello World'));  // 7
console.log(vowelsIn('sequoia'));             // ['e','u','o','i','a']
console.log(removeVowels('JavaScript'));      // 'JvScrpt'

module.exports = { countVowels, countVowelsRegex, countVowelsUnicode, countVowelsWithY, vowelBreakdown, countConsonants, vowelsIn, removeVowels };

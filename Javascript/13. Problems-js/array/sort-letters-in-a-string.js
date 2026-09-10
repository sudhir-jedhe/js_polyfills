/**
 * Return a string with its letters in alphabetical order.
 *
 * Split, sort, join — with the wrinkle that the default sort compares
 * UTF-16 code units, so 'Z' sorts before 'a'.
 */

/** Code-unit order: uppercase letters all sort before lowercase ones. */
const sortLettersRaw = (str) => [...String(str)].sort().join('');

/** Case-insensitive alphabetical order. */
const sortLetters = (str) =>
  [...String(str)].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join('');

/** Locale-aware, so accented letters land where a reader expects. */
function sortLettersLocale(str, locale = 'en') {
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });
  return [...String(str)].sort(collator.compare).join('');
}

/** Letters only, everything else dropped. */
const sortLettersOnly = (str) =>
  (String(str).match(/[a-z]/gi) || []).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join('');

/** Descending. */
const sortLettersDesc = (str) => [...sortLetters(str)].reverse().join('');

/** Sort each WORD's letters, keeping the word order. */
const sortEachWord = (str) =>
  String(str)
    .split(/(\s+)/)
    .map((part) => (/\s/.test(part) ? part : sortLetters(part)))
    .join('');

/**
 * Counting sort over a-z — O(n) instead of O(n log n), which matters for
 * long strings and is the standard anagram-key trick.
 */
function sortLettersCounting(str) {
  const counts = new Array(26).fill(0);
  let other = '';

  for (const ch of String(str).toLowerCase()) {
    const i = ch.charCodeAt(0) - 97;
    if (i >= 0 && i < 26) counts[i]++;
    else other += ch;
  }

  return counts.map((n, i) => String.fromCharCode(97 + i).repeat(n)).join('') + other;
}

/** Two strings are anagrams iff their sorted letters match. */
const areAnagrams = (a, b) => sortLettersOnly(a) === sortLettersOnly(b);

// ---- Examples ----
console.log(sortLettersRaw('Hello'));        // 'Hello' by code units
console.log(sortLetters('hello'));           // 'ehllo'
console.log(sortLetters('JavaScript'));      // case-insensitive order
console.log(sortLettersOnly('a1b!c'));       // 'abc'
console.log(sortLettersDesc('hello'));       // 'ollhe'
console.log(sortEachWord('hello world'));    // 'ehllo dlorw'
console.log(sortLettersCounting('banana'));  // 'aaabnn'
console.log(areAnagrams('listen', 'Silent'));// true

module.exports = { sortLetters, sortLettersRaw, sortLettersLocale, sortLettersOnly, sortLettersDesc, sortEachWord, sortLettersCounting, areAnagrams };

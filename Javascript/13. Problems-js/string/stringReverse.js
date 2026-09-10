/**
 * Reverse a string.
 *
 * split('').reverse().join('') is the textbook answer and it is WRONG for
 * emoji and combining characters. Four correct-to-varying-degrees versions
 * are below.
 */

/** Textbook version — breaks surrogate pairs. */
const reverseNaive = (str) => String(str).split('').reverse().join('');

/** Spread iterates code points, so emoji survive. */
const reverse = (str) => [...String(str)].reverse().join('');

/** Manual loop — no intermediate array, fastest for long ASCII strings. */
function reverseLoop(str) {
  let out = '';
  for (let i = str.length - 1; i >= 0; i--) out += str[i];
  return out;
}

/** Recursive, for the "do it without loops" variant of the question. */
const reverseRecursive = (str) => (str.length <= 1 ? str : reverseRecursive(str.slice(1)) + str[0]);

/**
 * Grapheme-correct: keeps flags, skin-tone modifiers and combining accents
 * intact. This is the only version that is right for all Unicode.
 */
function reverseGraphemes(str, locale = 'en') {
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return reverse(str);
  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  return [...segmenter.segment(String(str))].map((s) => s.segment).reverse().join('');
}

/** Reverse the words rather than the characters. */
const reverseWords = (str) => String(str).trim().split(/\s+/).reverse().join(' ');

// ---- Examples ----
console.log(reverse('hello'));            // 'olleh'
console.log(reverseNaive('ab🙂').length); // 4 — the emoji is torn apart
console.log(reverse('ab🙂'));              // '🙂ba'
console.log(reverseLoop('javascript'));   // 'tpircsavaj'
console.log(reverseRecursive('abc'));     // 'cba'
console.log(reverseGraphemes('née'));     // 'éen'
console.log(reverseWords('one two three'));// 'three two one'

module.exports = { reverse, reverseNaive, reverseLoop, reverseRecursive, reverseGraphemes, reverseWords };

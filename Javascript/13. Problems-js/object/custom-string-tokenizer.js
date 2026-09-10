/**
 * Custom string tokenizer.
 *
 * Split a string into tokens on a set of delimiters, with an iterator
 * interface (hasNext / next) like Java's StringTokenizer, plus a small
 * expression tokenizer that classifies each token.
 */

class StringTokenizer {
  /**
   * @param {string} str
   * @param {string} [delimiters=' \t\n\r'] each character is a delimiter
   * @param {boolean} [returnDelimiters=false] emit delimiters as tokens too
   */
  constructor(str, delimiters = ' \t\n\r', returnDelimiters = false) {
    this.str = String(str);
    this.delims = new Set(delimiters);
    this.returnDelimiters = returnDelimiters;
    this.pos = 0;
  }

  hasNext() {
    if (this.returnDelimiters) return this.pos < this.str.length;

    let i = this.pos;
    while (i < this.str.length && this.delims.has(this.str[i])) i++;
    return i < this.str.length;
  }

  next() {
    if (this.returnDelimiters && this.delims.has(this.str[this.pos])) {
      return this.str[this.pos++];
    }

    // skip leading delimiters
    while (this.pos < this.str.length && this.delims.has(this.str[this.pos])) this.pos++;
    if (this.pos >= this.str.length) return null;

    const start = this.pos;
    while (this.pos < this.str.length && !this.delims.has(this.str[this.pos])) this.pos++;
    return this.str.slice(start, this.pos);
  }

  /** All remaining tokens at once. */
  tokens() {
    const out = [];
    let token;
    while ((token = this.next()) !== null) out.push(token);
    return out;
  }

  /** Makes the tokenizer usable in for...of and spread. */
  *[Symbol.iterator]() {
    let token;
    while ((token = this.next()) !== null) yield token;
  }
}

/**
 * Tokenize a simple arithmetic expression into typed tokens.
 * @param {string} input
 * @returns {Array<{type:string, value:string}>}
 */
function tokenizeExpression(input) {
  const spec = [
    ['whitespace', /^\s+/],
    ['number', /^\d+(?:\.\d+)?/],
    ['identifier', /^[A-Za-z_]\w*/],
    ['operator', /^[+\-*/%^=]/],
    ['paren', /^[()]/],
  ];

  const tokens = [];
  let rest = String(input);

  while (rest.length) {
    const match = spec.find(([, re]) => re.test(rest));
    if (!match) throw new SyntaxError(`Unexpected character: ${rest[0]}`);

    const [type, re] = match;
    const [value] = rest.match(re);
    rest = rest.slice(value.length);

    if (type !== 'whitespace') tokens.push({ type, value });
  }

  return tokens;
}

// ---- Examples ----
const t = new StringTokenizer('a,b;;c', ',;');
console.log(t.tokens()); // ['a', 'b', 'c']

console.log([...new StringTokenizer('  hello   world  ')]); // ['hello', 'world']

console.log(tokenizeExpression('2 * (x + 10)'));
// [{number 2}, {operator *}, {paren (}, {identifier x}, {operator +}, {number 10}, {paren )}]

module.exports = { StringTokenizer, tokenizeExpression };

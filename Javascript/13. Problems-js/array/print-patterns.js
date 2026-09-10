/**
 * Star and triangle patterns.
 *
 * Hollow triangle inside a triangle, a solid square, and the usual family
 * of printed shapes. Each returns an array of lines so the output can be
 * tested, with a print helper on top.
 */

/** Solid square of stars. */
const squarePattern = (n, ch = '*') =>
  Array.from({ length: n }, () => ch.repeat(n));

/** Hollow square: only the border. */
const hollowSquare = (n, ch = '*') =>
  Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) =>
      r === 0 || r === n - 1 || c === 0 || c === n - 1 ? ch : ' '
    ).join('')
  );

/** Right triangle. */
const rightTriangle = (n, ch = '*') =>
  Array.from({ length: n }, (_, r) => ch.repeat(r + 1));

/** Centred pyramid. */
const pyramid = (n, ch = '*') =>
  Array.from({ length: n }, (_, r) => ' '.repeat(n - r - 1) + ch.repeat(2 * r + 1));

/** Hollow pyramid: only the two sides and the base. */
const hollowPyramid = (n, ch = '*') =>
  Array.from({ length: n }, (_, r) => {
    const width = 2 * r + 1;
    const padding = ' '.repeat(n - r - 1);

    if (r === n - 1) return padding + ch.repeat(width);
    if (r === 0) return padding + ch;

    return `${padding}${ch}${' '.repeat(width - 2)}${ch}`;
  });

/**
 * A hollow triangle drawn INSIDE a solid triangle: the outer border is
 * solid, and a second, smaller hollow triangle sits within it.
 */
function hollowInsideTriangle(n, ch = '*', inner = '.') {
  const lines = [];

  for (let r = 0; r < n; r++) {
    const width = 2 * r + 1;
    const padding = ' '.repeat(n - r - 1);
    const row = new Array(width).fill(ch);

    // Carve out an inner hollow triangle two rows in from the border.
    if (r >= 2 && r < n - 1) {
      for (let c = 1; c < width - 1; c++) row[c] = ' ';

      const innerRow = r - 2;
      const innerHeight = n - 3;

      if (innerRow >= 0 && innerRow <= innerHeight) {
        const innerWidth = 2 * innerRow + 1;
        const start = r - innerRow;

        if (innerRow === innerHeight) {
          for (let c = 0; c < innerWidth; c++) row[start + c] = inner;
        } else {
          row[start] = inner;
          row[start + innerWidth - 1] = inner;
        }
      }
    }

    lines.push(padding + row.join(''));
  }

  return lines;
}

/** Diamond. */
const diamond = (n, ch = '*') => {
  const top = pyramid(n, ch);
  return [...top, ...top.slice(0, -1).reverse()];
};

/** Print any pattern. */
const print = (lines) => lines.forEach((line) => console.log(line));

// ---- Examples ----
print(squarePattern(3));
console.log('---');
print(hollowSquare(4));
console.log('---');
print(pyramid(4));
console.log('---');
print(hollowPyramid(5));
console.log('---');
print(hollowInsideTriangle(7));
console.log('---');
print(diamond(3));

module.exports = { squarePattern, hollowSquare, rightTriangle, pyramid, hollowPyramid, hollowInsideTriangle, diamond, print };

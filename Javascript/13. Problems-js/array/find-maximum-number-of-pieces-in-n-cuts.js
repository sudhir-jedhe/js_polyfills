/**
 * Maximum number of pieces from n cuts.
 *
 * The classic "lazy caterer" results, in one, two and three dimensions.
 */

/**
 * 1-D (a line/rope): each cut adds exactly one piece.
 * pieces = n + 1
 */
const piecesOfLine = (n) => n + 1;

/**
 * 2-D (a pancake / circle), the lazy caterer's sequence: the k-th cut can
 * cross all k-1 earlier cuts, adding k new pieces.
 * pieces = 1 + n(n + 1)/2
 */
const piecesOfPlane = (n) => 1 + (n * (n + 1)) / 2;

/**
 * 3-D (a cake), the cake number:
 * pieces = (n^3 + 5n + 6) / 6
 */
const piecesOfCake = (n) => (n ** 3 + 5 * n + 6) / 6;

/**
 * Grid cuts: h horizontal and v vertical cuts of a rectangle.
 * pieces = (h + 1) * (v + 1)
 */
const piecesOfGrid = (h, v) => (h + 1) * (v + 1);

/**
 * The related LeetCode 1465: maximise the AREA of a piece after cutting at
 * given positions — the answer is the widest gap times the tallest gap.
 */
function maxAreaAfterCuts(h, w, horizontalCuts, verticalCuts) {
  const maxGap = (cuts, limit) => {
    const sorted = [...cuts].sort((a, b) => a - b);
    let best = sorted[0];

    for (let i = 1; i < sorted.length; i++) best = Math.max(best, sorted[i] - sorted[i - 1]);
    return Math.max(best, limit - sorted[sorted.length - 1]);
  };

  const MOD = 1_000_000_007n;
  return Number((BigInt(maxGap(horizontalCuts, h)) * BigInt(maxGap(verticalCuts, w))) % MOD);
}

/** The sequence of piece counts, handy for checking the formulas. */
const pieceSequence = (fn, upTo) => Array.from({ length: upTo + 1 }, (_, n) => fn(n));

// ---- Examples ----
console.log(piecesOfLine(3));            // 4
console.log(piecesOfPlane(3));           // 7
console.log(piecesOfCake(3));            // 8
console.log(piecesOfGrid(2, 3));         // 12
console.log(pieceSequence(piecesOfPlane, 6)); // [1,2,4,7,11,16,22]
console.log(maxAreaAfterCuts(5, 4, [1, 2, 4], [1, 3])); // 4

module.exports = { piecesOfLine, piecesOfPlane, piecesOfCake, piecesOfGrid, maxAreaAfterCuts, pieceSequence };

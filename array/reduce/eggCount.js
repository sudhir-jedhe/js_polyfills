export const eggCount = (displayValue) =>
  [...displayValue.toString(2)].reduce(
    (acc, curr) => (curr === "1" ? (acc += 1) : acc),
    0
  );

//   Chicken Coop:
//  _ _ _ _ _ _ _
// |E| |E|E| | |E|

// Resulting Binary:
//  1 0 1 1 0 0 1

// Decimal number on the display:
// 89

// Actual eggs in the coop:
// 4

// Chicken Coop:
//  _ _ _ _ _ _ _ _
// | | | |E| | | | |

// Resulting Binary:
//  0 0 0 1 0 0 0 0

// Decimal number on the display:
// 16

// Actual eggs in the coop:
// 1

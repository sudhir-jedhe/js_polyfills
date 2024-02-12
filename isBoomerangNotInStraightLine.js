export function isBoomerang(points) {
  const [x1, y1] = points[0];
  const [x2, y2] = points[1];
  const [x3, y3] = points[2];

  // Calculate slopes
  const slope1 = (y2 - y1) * (x3 - x2);
  const slope2 = (y3 - y2) * (x2 - x1);

  // Check if slopes are not equal (not in a straight line)
  return slope1 !== slope2;
}

const points1 = [
  [1, 1],
  [2, 3],
  [3, 2],
];
console.log(isBoomerang(points1)); // Output: true

const points2 = [
  [1, 1],
  [2, 2],
  [3, 3],
];
console.log(isBoomerang(points2)); // Output: false

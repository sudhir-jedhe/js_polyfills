function detectType(data) {
  return Object.prototype.toString
    .call(data)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

// detectType(1); // Output: 'number'
// detectType(new Map()); // Output: 'map'
// detectType([]); // Output: 'array'
// detectType(null); // Output: 'null'

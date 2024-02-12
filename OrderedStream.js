class OrderedStream {
  constructor(n) {
    this.stream = new Array(n + 1).fill(null); // Initialize the stream array
    this.ptr = 1; // Pointer to the current position in the stream
  }

  insert(idKey, value) {
    this.stream[idKey] = value; // Insert the value at the specified index

    const result = [];
    // Check if the next position in the stream is filled
    while (this.stream[this.ptr]) {
      result.push(this.stream[this.ptr]); // Add the value to the result
      this.ptr++; // Move the pointer to the next position
    }

    return result;
  }
}

const os = new OrderedStream(5); // Create an OrderedStream with capacity 5
console.log(os.insert(3, "ccccc")); // Output: []
console.log(os.insert(1, "aaaaa")); // Output: ["aaaaa"]
console.log(os.insert(2, "bbbbb")); // Output: ["bbbbb", "ccccc"]
console.log(os.insert(5, "eeeee")); // Output: []
console.log(os.insert(4, "ddddd")); // Output: ["ddddd", "eeeee"]

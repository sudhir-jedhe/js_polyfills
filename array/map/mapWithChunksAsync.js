async function mapWithChunksAsync(array, mapper, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const mappedChunk = await Promise.all(chunk.map(mapper));
    results.push(...mappedChunk);
  }
  return results;
}

// Example async mapping function
async function asyncMapper(value) {
  return value * 2; // Perform some async operation
}

// Example usage of mapWithChunksAsync
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunkSize = 2;
mapWithChunksAsync(array, asyncMapper, chunkSize)
  .then((mappedArray) => {
    console.log(mappedArray); // Output: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  })
  .catch((error) => {
    console.error(error);
  });

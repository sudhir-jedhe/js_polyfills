/**********************************************Implement a  generate a range of numbers  *****************************************/
function generateRange(start, end, step = 1) {
    if (typeof start !== 'number' || typeof end !== 'number' || typeof step !== 'number') {
      throw new Error('All parameters must be numbers.');
  }

  const result = [];
  
  if (step === 0) {
      throw new Error('Step cannot be zero.');
  }

  if ((start < end && step < 0) || (start > end && step > 0)) {
      throw new Error('Invalid range and step combination.');
  }

  for (let i = start; (step > 0 ? i <= end : i >= end); i += step) {
      result.push(i);
  }

  return result;
}

// Example usage:

const range = generateRange(1, 10, 2);
console.log(range);
// Output: [1, 3, 5, 7, 9]
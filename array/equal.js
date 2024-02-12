export const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((val, i) => val === arr2[i]);
};

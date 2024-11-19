const arr = [1.1, 1.2, 1.3, 2.2, 2.3, 2.4];

const segg = arr.reduce((previousValue, currentValue) => {
  
  // round of the value
  const floored = Math.floor(currentValue);
  
  // if the key is not present
  // create a new entry with the array value
  if(!previousValue[floored]){
    previousValue[floored] = [];
  }
  
  // segregate the current value in the respective key
  previousValue[floored].push(currentValue);
  
  // return the updated value
  return previousValue;
}, {});

console.log(segg);
/*
{
  1: [1.1, 1.2, 1.3],
  2: [2.2, 2.3, 2.4]
}
*/
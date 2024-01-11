//In this approach, we are traversing each character of the string and checking if it is the same as the last character or not 
//using the replace method. If it is the same, then we skip it; otherwise, we return it.


/*************Remove Consecutive Duplicate Characters From a String*************** */


const eleminateSameConsecutiveCharacters = (inputData) => {
  return inputData.replace(/(.)\1+/g, "$1");
};

const testString = "Geeks For Geeks";
console.log(eleminateSameConsecutiveCharacters(testString));

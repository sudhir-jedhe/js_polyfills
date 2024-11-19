// functions
const upperCase = (str) => {
    return str.toUpperCase();
  };
  
  const reverse = (str) => {
    return str.split('').reverse().join('');
  };
  
  const append = (str) => {
    return "Hello " + str;
  };
  
  // array of functions to be piped
  const arr = [upperCase, reverse, append];
  
  // initial value
  const initialValue = "learnersbucket";
  
  const finalValue = arr.reduce((previousValue, currentElement) => {
    // pass the value through each function
    // currentElement is the function from the array
    const newValue = currentElement(previousValue);
    
    // return the value received from the function
    return newValue;
    
  }, initialValue);
  
  console.log(finalValue);
  
  // "Hello TEKCUBSRENRAEL"
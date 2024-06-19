const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    //Error
    //JSON is not okay
    return false;
  }

  return true;
};


// isValidJSON 

const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

isValidJSON('{"name":"Adam","age":20}'); // true
isValidJSON('{"name":"Adam",age:"20"}'); // false
isValidJSON(null); // true

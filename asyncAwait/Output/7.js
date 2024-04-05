// In the async() function, we will create a new try/catch block. In the try block,
//  we will call our first function which is throwing error. In the catch statement,
//  we will catch the error which we have received from the first function.
//  In the output, we will see that no extra line gets printed,
// only the catch statement line will be printed which is the desired result.
let exception_thrown_method = () => {
  return Promise.reject("Exception thrown...!!");
};

let catchException = async () => {
  try {
    await exception_thrown_method();
    console.log("Stop code's execution here only....!!");
  } catch (error) {
    console.log("Caught Error: " + error);
  }
};

catchException();
// Caught Error: Exception thrown...!!

// We will do certain changes in catchException() async() method.
// In this async function, we will create a variable to call our method and later use the catch() method
// and then return “null” which seems to be like having a flag variable. Check whether the variable’s
// value is null writing an empty return statement.
// In the output, we will see no extra line gets printed, only the required line gets printed.

let exception_thrown_method = () => {
  return Promise.reject("Exception thrown...!!");
};

let catchException = async () => {
  let result = await exception_thrown_method().catch((error) => {
    console.log("Caught error: " + error);
    return null;
  });

  if (result === null) {
    return;
  }
  console.log("Stop code's execution here only...");
};

catchException();

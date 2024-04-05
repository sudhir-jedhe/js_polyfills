// Why does exception still get thrown after catch in async function ?

// We will create a new function that will throw an error, either using Promise.reject() method
// or with the throw statement. We will catch that throw error in another function which
//  will be the async() function and then the rest part of our code also gets executed which is not required.
let exception_thrown_method = () => {
  return Promise.reject("Exception thrown...!!");
};

let catchException = async () => {
  let msg = await exception_thrown_method().catch((error) =>
    console.log("Caught Error: " + error)
  );
  console.log("Stop code's execution.....");
};

catchException();
// Caught Error: Exception thrown...!!
// Stop code's execution.....

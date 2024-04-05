//catching-multiple-async-errors
let first_async_error = () => {
  return new Promise((resolve, reject) => {
    reject("Something went wrong....!!");
  });
};

let second_async_error = () => {
  return new Promise((resolve, reject) => {
    reject("Error 404....!!");
  });
};

let catchAllErrors = async () => {
  try {
    await first_async_error();
  } catch (error) {
    console.log("First Error: " + error);
  }

  try {
    await second_async_error();
  } catch (error) {
    console.log("Second Error: " + error);
  }
};

catchAllErrors();
// First Error: Something went wrong....!!
// Second Error: Error 404....!!

let first_async_error = () => {
  return new Promise((resolve, reject) => {
    reject("Something went wrong....!!");
  });
};

let second_async_error = () => {
  return new Promise((resolve, reject) => {
    reject("Error 404....!!");
  });
};

let catchAllErrors = async () => {
  let result_1 = await first_async_error().catch((error) => {
    return "First Error: " + error;
  });

  let result_2 = await second_async_error().catch((error) => {
    return "Second Error: " + error;
  });

  console.log(result_1);
  console.log(result_2);
};

catchAllErrors();

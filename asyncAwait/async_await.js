const work = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("doing work"), 3000);
  });
};

const doWork = async () => {
  console.log(await work());
};

console.log("before");
doWork();
console.log("after");
/*  before
    after
    doing work
*/

/******************************** */
const work = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("doing work"), 3000);
  });
};

console.log("before");

work().then((e) => {
  console.log(e);
  console.log("finished");
});

console.log("after");
/**************************************************** */
async function doRequest() {
  let url = "http://webcode.me";
  let res = await fetch(url);

  if (res.ok) {
    let text = await res.text();

    return text;
  } else {
    return `HTTP error: ${res.status}`;
  }
}

doRequest().then((data) => {
  console.log(data);
});

/**************************** */

// delay-a-loop-in-javascript-using-async-await-with-promise

function waitforme(millisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, millisec);
  });
}

async function printy() {
  for (let i = 0; i < 10; ++i) {
    await waitforme(1000);
    console.log(i);
  }
  console.log("Loop execution finished!)");
}

printy();

/************************************************************************* */
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

/*************************** */
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

/************************************************ */
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

/***************************************************************** */
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

/************************************************* */
// This is a JavaScript Quiz from BFE.dev

async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}

async function async2() {
  console.log(3);
}

console.log(4);

setTimeout(function () {
  console.log(5);
}, 0);

async1();

new Promise(function (resolve) {
  console.log(6);
  resolve();
}).then(function () {
  console.log(7);
});

console.log(8);

// In this tutorial, we will see how to create a fetch method with Timeout in JavaScript that will terminate the API call, if it is fulfilled in the given duration.

// There are cases in programming where we want to complete the network calls in a certain duration to boost performance.

// The original fetch method does not come with an option to abort in X times, thus it is often asked during interviews to create your custom function fetch with a timeout, which will abort the network call if it is not completed in a specified duration.

// To implement this, we will make use of the AbortController() that is introduced lately using which we can abort the ongoing network request in the fetch.

// We will create a wrapper function that will accept the URL And configuration options of fetch and timeout duration, from this function we will return a new promise that will resolve if the fetch method is fulfilled.

// Inside that, we will define the AbortController() and control the network request. In each function call, start the setTimeout that will abort the request after a given duration.

// Both fetch and setTimeout will work in parallel and depending upon which finishes first will decide the outcome of the promise.


const fetchWithTimeout = (url, duration) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const signal = controller.signal;
    let timerid = null;

    fetch(url, { signal })
      .then((resp) => {
        resp
          .json()
          .then((e) => {
            clearTimeout(timerid);
            resolve(e);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });

    timerid = setTimeout(() => {
      console.log("Aborted");
      controller.abort();
    }, duration);
  });
};

fetchWithTimeout("https://jsonplaceholder.typicode.com/todos/1", 100)
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => {
    console.error(error);
  });

// Aborted
// error

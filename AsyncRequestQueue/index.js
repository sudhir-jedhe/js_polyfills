// Example API function
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched");
    }, 1000);
  });
};

const queue = new AsyncRequestQueue();

// Enqueue requests
queue
  .enqueue(fetchData)
  .then((result) => {
    console.log(result); // Output: Data fetched
  })
  .catch((error) => {
    console.error(error);
  });

queue
  .enqueue(fetchData)
  .then((result) => {
    console.log(result); // Output: Data fetched
  })
  .catch((error) => {
    console.error(error);
  });

queue
  .enqueue(fetchData)
  .then((result) => {
    console.log(result); // Output: Data fetched
  })
  .catch((error) => {
    console.error(error);
  });

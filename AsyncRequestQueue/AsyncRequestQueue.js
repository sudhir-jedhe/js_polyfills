class AsyncRequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(requestFunction) {
    return new Promise((resolve, reject) => {
      const request = { requestFunction, resolve, reject };
      this.queue.push(request);
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const { requestFunction, resolve, reject } = this.queue.shift();
      try {
        const result = await requestFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    this.isProcessing = false;
  }
}



/*************************************************** */

async function requestQueue(requests) {
  const results = [];

  for (const request of requests) {
      try {
          const result = await request();
          results.push(result);
      } catch (error) {
          // If any request fails, push the error to the results array
          results.push({ error });
      }
  }

  return results;
}

// Example usage:
// Define your request functions
const request1 = async () => {
  return await fetch('https://api.example.com/endpoint1');
};

const request2 = async () => {
  return await fetch('https://api.example.com/endpoint2');
};

// Create a queue of requests
const requests = [request1, request2];

// Execute the request queue sequentially
requestQueue(requests)
  .then(results => {
      console.log(results);
  })
  .catch(error => {
      console.error(error);
  });

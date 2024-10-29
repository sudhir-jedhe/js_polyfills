class APIBatchRequester {
    constructor(batchSize, interval) {
      this.batchSize = batchSize; // Max number of requests per batch
      this.interval = interval; // Time interval in milliseconds
      this.requestsQueue = []; // Queue for storing requests
      this.isProcessing = false; // Flag to indicate if processing is in progress
    }
  
    // Method to add a new request
    addRequest(apiCall) {
      this.requestsQueue.push(apiCall);
      this.processQueue();
    }
  
    // Method to process the request queue
    async processQueue() {
      if (this.isProcessing) return; // Avoid processing if already in progress
  
      this.isProcessing = true;
  
      while (this.requestsQueue.length > 0) {
        // Get a batch of requests
        const batch = this.requestsQueue.splice(0, this.batchSize);
  
        // Execute the batch
        await this.executeBatch(batch);
  
        // Wait for the specified interval before processing the next batch
        await this.sleep(this.interval);
      }
  
      this.isProcessing = false; // Reset the processing flag
    }
  
    // Method to execute a batch of API calls
    async executeBatch(batch) {
      const promises = batch.map(apiCall => apiCall());
  
      try {
        const results = await Promise.all(promises);
        console.log('Batch results:', results);
      } catch (error) {
        console.error('Batch error:', error);
      }
    }
  
    // Utility method to sleep for a given duration
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  // Usage example
  const apiRequester = new APIBatchRequester(3, 2000); // 3 requests per batch, 2 seconds interval
  
  // Example API call function
  const makeApiCall = (id) => {
    return async () => {
      const response = await fetch(`https://api.example.com/data/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    };
  };
  
  // Adding requests
  for (let i = 1; i <= 10; i++) {
    apiRequester.addRequest(makeApiCall(i));
  }
  


  /*********************************** */

  class APIBatchRequester {
    constructor(batchSize, interval) {
      this.batchSize = batchSize;
      this.interval = interval;
      this.requestsQueue = [];
      this.isProcessing = false;
    }
  
    addRequest(apiCall) {
      this.requestsQueue.push(apiCall);
      this.processQueue();
    }
  
    async processQueue() {
      if (this.isProcessing) return;
      this.isProcessing = true;
  
      while (this.requestsQueue.length > 0) {
        const batch = this.requestsQueue.splice(0, this.batchSize);
        await this.executeBatch(batch);
        await this.sleep(this.interval);
      }
  
      this.isProcessing = false;
    }
  
    async executeBatch(batch) {
      const promises = batch.map(apiCall => apiCall());
      try {
        const results = await Promise.all(promises);
        console.log('Batch results:', results);
      } catch (error) {
        console.error('Error in batch:', error);
      }
    }
  
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  // Usage example
  const apiRequester = new APIBatchRequester(3, 2000);
  
  const makeApiCall = (id) => {
    return async () => {
      const response = await fetch(`https://api.example.com/data/${id}`);
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    };
  };
  
  // Add requests
  for (let i = 1; i <= 10; i++) {
    apiRequester.addRequest(makeApiCall(i));
  }
  
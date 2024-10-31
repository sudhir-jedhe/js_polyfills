class RateLimiter {
    constructor(maxRequests, interval) {
      this.maxRequests = maxRequests; // Maximum requests allowed
      this.interval = interval; // Time interval in milliseconds
      this.queue = []; // Queue to hold pending requests
      this.currentRequests = 0; // Track current requests
      this.lastReset = Date.now(); // Track when the rate limit was last reset
    }
  
    addRequest(apiCall) {
      this.queue.push(apiCall);
      this.processQueue();
    }
  
    async processQueue() {
      if (this.currentRequests >= this.maxRequests) {
        const timeToWait = this.interval - (Date.now() - this.lastReset);
        if (timeToWait > 0) {
          await this.sleep(timeToWait);
        }
        this.currentRequests = 0;
        this.lastReset = Date.now();
      }
  
      while (this.queue.length > 0 && this.currentRequests < this.maxRequests) {
        const apiCall = this.queue.shift();
        this.currentRequests++;
        try {
          const result = await apiCall();
          console.log('API call result:', result);
        } catch (error) {
          console.error('Error in API call:', error);
        }
      }
  
      if (this.queue.length > 0) {
        this.processQueue(); // Process remaining requests
      }
    }
  
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  
  // Usage example
  const rateLimiter = new RateLimiter(5, 10000); // 5 requests every 10 seconds
  
  const makeApiCall = (id) => {
    return async () => {
      const response = await fetch(`https://api.example.com/data/${id}`);
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    };
  };
  
  // Add requests
  for (let i = 1; i <= 15; i++) {
    rateLimiter.addRequest(makeApiCall(i));
  }
  


  /********************************* */

  class DebouncedRateLimiter {
    constructor(maxRequests, interval) {
      this.maxRequests = maxRequests; // Maximum requests allowed
      this.interval = interval; // Time interval in milliseconds
      this.queue = []; // Queue to hold pending requests
      this.timeout = null; // Timer for debouncing
    }
  
    addRequest(apiCall) {
      this.queue.push(apiCall);
      this.debounceProcess();
    }
  
    debounceProcess() {
      // Clear existing timeout if it's already set
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
  
      // Set a new timeout to process the queue
      this.timeout = setTimeout(() => {
        this.processQueue();
      }, this.interval);
    }
  
    async processQueue() {
      // Limit the number of requests processed
      const requestsToProcess = this.queue.splice(0, this.maxRequests);
  
      if (requestsToProcess.length === 0) return;
  
      const promises = requestsToProcess.map(apiCall => apiCall());
  
      try {
        const results = await Promise.all(promises);
        console.log('API call results:', results);
      } catch (error) {
        console.error('Error in API call:', error);
      }
  
      // Continue processing if there are more requests
      if (this.queue.length > 0) {
        this.debounceProcess(); // Restart the debouncing
      }
    }
  }
  
  // Usage example
  const debouncedRateLimiter = new DebouncedRateLimiter(5, 3000); // 5 requests every 3 seconds
  
  const makeApiCall = (id) => {
    return async () => {
      const response = await fetch(`https://api.example.com/data/${id}`);
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    };
  };
  
  // Add requests
  for (let i = 1; i <= 15; i++) {
    debouncedRateLimiter.addRequest(makeApiCall(i));
  }
  
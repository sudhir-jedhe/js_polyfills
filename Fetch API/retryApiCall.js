async function retryApiCall(apiFunction, maxRetries, retryInterval) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await apiFunction();
            return result; // Return the result if the API call is successful
        } catch (error) {
            if (attempt < maxRetries) {
                // If not the last attempt, wait for the retry interval before trying again
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            } else {
                // If it's the last attempt and still unsuccessful, throw the error
                throw error;
            }
        }
    }
}

// Example usage:
// Define your API function to retry (replace with your actual API function)
async function myApiFunction() {
    // Simulate API call that might fail
    const randomNum = Math.random();
    if (randomNum < 0.8) {
        return 'API call successful';
    } else {
        throw new Error('API call failed');
    }
}

// Call retryApiCall with your API function and retry parameters
retryApiCall(myApiFunction, 3, 1000) // Retry up to 3 times with a retry interval of 1000ms
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Failed after retries:', error.message));



    /******************************************** */

    class DebouncedRateLimiter {
        constructor(maxRequests, interval, maxRetries) {
          this.maxRequests = maxRequests; // Maximum requests allowed
          this.interval = interval; // Time interval in milliseconds
          this.maxRetries = maxRetries; // Maximum number of retries on failure
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
          const requestsToProcess = this.queue.splice(0, this.maxRequests);
      
          if (requestsToProcess.length === 0) return;
      
          const promises = requestsToProcess.map(apiCall => this.retryRequest(apiCall, this.maxRetries));
      
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
      
        async retryRequest(apiCall, retries) {
          for (let attempt = 0; attempt < retries; attempt++) {
            try {
              return await apiCall();
            } catch (error) {
              if (attempt === retries - 1) {
                throw error; // Throw error if it's the last attempt
              }
              console.warn(`Retrying request... Attempt ${attempt + 1}`);
            }
          }
        }
        
        sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      }
      
      // Usage example
      const debouncedRateLimiter = new DebouncedRateLimiter(5, 3000, 3); // 5 requests every 3 seconds, 3 retries
      
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
      
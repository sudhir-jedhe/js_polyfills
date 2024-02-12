class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit; // Maximum number of requests allowed
    this.interval = interval; // Time interval (in milliseconds)
    this.requests = []; // Queue to store timestamps of recent requests
  }

  allowRequest() {
    const now = Date.now();

    // Remove timestamps that are older than the interval
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp <= this.interval
    );

    // Check if the number of requests exceeds the limit
    if (this.requests.length < this.limit) {
      this.requests.push(now); // Add current timestamp to the queue
      return true; // Request is allowed
    } else {
      return false; // Request is not allowed
    }
  }
}

const limiter = new RateLimiter(5, 10000); // Allow 5 requests every 10 seconds

// Simulate making requests
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    if (limiter.allowRequest()) {
      console.log("Request allowed");
    } else {
      console.log("Request blocked");
    }
  }, i * 2000); // Make a request every 2 seconds
}

/*********************************** */
class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit; // Maximum number of requests allowed within the interval
    this.interval = interval; // Interval (in milliseconds) within which requests are allowed
    this.requests = []; // Array to store timestamps of recent requests
  }

  // Check if the rate limit has been reached
  checkLimit() {
    const now = Date.now();
    // Remove timestamps older than the interval
    this.requests = this.requests.filter(
      (timestamp) => timestamp > now - this.interval
    );
    // Check if the number of requests is less than the limit
    return this.requests.length < this.limit;
  }

  // Make a request and return true if allowed, false if rate limit reached
  makeRequest() {
    if (this.checkLimit()) {
      this.requests.push(Date.now());
      return true;
    }
    return false;
  }
}

// Example usage:
const rateLimiter = new RateLimiter(10, 60000); // Allow up to 10 requests per minute

for (let i = 0; i < 15; i++) {
  const allowed = rateLimiter.makeRequest();
  console.log(
    `Request ${i + 1}: ${allowed ? "Allowed" : "Rate limit reached"}`
  );
}

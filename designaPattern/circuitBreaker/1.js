const circuitBreaker = (fn, failureCount, timeThreshold) => {
  let failures = 0;
  let timeSinceLastFailure = 0;
  let isClosed = false;

  return function (...args) {
    // if service is closed
    if (isClosed) {
      const diff = Date.now() - timeSinceLastFailure;

      // if the time since last failure has exceeded
      // the time threshold
      // open the service
      if (diff > timeThreshold) {
        isClosed = false;
      }
      // else throw error
      else {
        console.error("Service unavailable");
        return;
      }
    }

    // try running the function
    // if it passes reset the failure count
    try {
      const result = fn(...args);
      failures = 0;
      return result;
    } catch (error) {
      // if function throws error / fails
      // increase the failure count and
      // timewhen it fails
      failures++;
      timeSinceLastFailure = Date.now();
      if (failures >= failureCount) {
        isClosed = true;
      }

      console.log("Error");
    }
  };
};

// test function
const testFunction = () => {
  let count = 0;

  return function () {
    count++;
    if (count < 4) {
      throw "failed";
    } else {
      return "hello";
    }
  };
};

let t = testFunction();
let c = circuitBreaker(t, 3, 200);

c(); // "error"
c(); // "error"
c(); // "error"

// service is closed for 200 MS
c(); // "service unavailable"
c(); // "service unavailable"
c(); // "service unavailable"
c(); // "service unavailable"
c(); // "service unavailable"

// service becomes available after 300ms
setTimeout(() => {
  console.log(c());
}, 300); // "hello";

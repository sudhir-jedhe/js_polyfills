class EventLogger {
  constructor() {
    this.logs = [];
  }

  log(eventType, eventData) {
    const logEntry = {
      type: eventType,
      data: eventData,
      timestamp: new Date(),
    };
    this.logs.push(logEntry);
    console.log(
      `[${logEntry.timestamp.toISOString()}] ${logEntry.type}:`,
      logEntry.data
    );
  }

  logEvent(eventType, eventData) {
    const timestamp = new Date().toISOString();
    const event = { timestamp, eventType, eventData };
    this.log.push(event);
    console.log("Event logged:", event);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

// Example usage:
const logger = new EventLogger();

logger.log("UserLoggedIn", { userId: 123 });
logger.log("ButtonClick", { buttonId: "submit" });

console.log("Logs:", logger.getLogs());

logger.clearLogs();
console.log("Logs after clearing:", logger.getLogs());

/*********************************** */
const eventLogger = new EventLogger();

// Log events
eventLogger.logEvent("click", { target: "button", action: "submit" });
eventLogger.logEvent("input", { field: "username", value: "john_doe" });

// Get log
const log = eventLogger.getLog();
console.log("Event log:", log);

// Clear log
eventLogger.clearLog();



/***************** */
// To implement the EventLogger object with the provided functionalities, you can use JavaScript's fetch API for sending requests and setTimeout for setting a delay. Here's how you can implement each method:
const EventLogger = {
  startTime: 0,
  responseDelay: 0,

  // Initialize the start time
  initializeStartTime: function() {
    this.startTime = Date.now();
  },

  // Set the fetch response delay
  setFetchResponseDelay: function(timeout = 0) {
    this.responseDelay = timeout;
  },

  // Reset the fetch response delay
  resetFetchResponseDelay: function() {
    this.responseDelay = 0;
  },

  // Send a request
  sendRequest: async function(body) {
    // Log the start time
    const start = Date.now();

    // Add delay if needed
    await new Promise(resolve => setTimeout(resolve, this.responseDelay));

    // Simulate sending request (replace with actual fetch call)
    console.log("Sending request:", body);

    // Log response time
    const responseTime = Date.now() - start;
    console.log("Response time:", responseTime);

    // Calculate elapsed time
    const elapsedTime = Date.now() - this.startTime;
    console.log("Elapsed time:", elapsedTime);
  }
};

// Example usage:
EventLogger.initializeStartTime();
EventLogger.setFetchResponseDelay(1000); // Set delay to 1 second
EventLogger.sendRequest({ key: "value" }); // Send request with delay


/************************************************************** */

// To implement the EventLogger class and attach event listeners to squares in the UI, you can define the class with methods for initializing, setting response delay, resetting delay, and sending requests. Then, you can attach event listeners to the squares using JavaScript. 

class EventLogger {
  constructor() {
    this.startTime = 0;
    this.responseDelay = 0;
  }

  // Initialize the start time
  initializeStartTime() {
    this.startTime = Date.now();
  }

  // Set the fetch response delay
  setFetchResponseDelay(timeout = 0) {
    this.responseDelay = timeout;
  }

  // Reset the fetch response delay
  resetFetchResponseDelay() {
    this.responseDelay = 0;
  }

  // Send a request
  sendRequest(body) {
    // Log the start time
    const start = Date.now();

    // Add delay if needed
    setTimeout(() => {
      // Simulate sending request (replace with actual fetch call)
      console.log("Sending request:", body);

      // Log response time
      const responseTime = Date.now() - start;
      console.log("Response time:", responseTime);

      // Calculate elapsed time
      const elapsedTime = Date.now() - this.startTime;
      console.log("Elapsed time:", elapsedTime);
    }, this.responseDelay);
  }
}

// Create an instance of EventLogger
const eventLogger = new EventLogger();

// Attach event listeners to squares in the UI
document.querySelectorAll('.square').forEach(square => {
  square.addEventListener('click', (e) => {
    eventLogger.initializeStartTime(); // Initialize start time for each click
    eventLogger.setFetchResponseDelay(1000); // Set delay to 1 second
    eventLogger.sendRequest({ key: "value" }); // Send request with delay
  });
});

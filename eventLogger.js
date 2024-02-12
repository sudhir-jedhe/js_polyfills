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

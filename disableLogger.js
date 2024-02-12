let isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  console.log = function () {};
}
/****************************** */

if (isProduction) {
  const noop = () => {};
  [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "exception",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "markTimeline",
    "profile",
    "profileEnd",
    "table",
    "time",
    "timeEnd",
    "timeline",
    "timelineEnd",
    "timeStamp",
    "trace",
    "warn",
  ].forEach((method) => {
    window.console[method] = noop;
  });
}
/*********************************** */
// .babel.rc

{
  "plugins": ["transform-remove-console"]
}

/************************************ */
class Logger {
  constructor() {
    // Set the default logging mode to true (enabled)
    this.loggingEnabled = true;
  }

  enableLogging() {
    this.loggingEnabled = true;
  }

  disableLogging() {
    this.loggingEnabled = false;
  }

  log(message) {
    if (this.loggingEnabled) {
      console.log(message);
    }
  }

  error(message) {
    if (this.loggingEnabled) {
      console.error(message);
    }
  }
}

// Create an instance of the logger
const logger = new Logger();

// Example usage
logger.log("This is a log message.");
logger.error("This is an error message.");

// Disable logging in production
isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  logger.disableLogging();
}

// Example usage in production
logger.log("This message won't be logged in production.");
logger.error("This error won't be logged in production.");

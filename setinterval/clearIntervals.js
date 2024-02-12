function clearAllIntervals() {
  // Get all interval IDs
  const intervalIds = Object.keys(window).filter((key) =>
    key.startsWith("interval")
  );

  // Clear each interval
  intervalIds.forEach((id) => {
    clearInterval(window[id]);
    delete window[id]; // Remove the interval ID from the window object
  });
}

// Set some intervals
const interval1 = setInterval(() => console.log("Interval 1"), 1000);
const interval2 = setInterval(() => console.log("Interval 2"), 2000);

// Clear all intervals
clearAllIntervals();

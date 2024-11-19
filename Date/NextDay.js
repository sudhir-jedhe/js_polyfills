// Extend the Date prototype to include a nextDay method
Date.prototype.nextDay = function() {
    const newDate = new Date(this); // Create a copy of the current date
    newDate.setDate(this.getDate() + 1); // Add 1 day to the current date
    return newDate.toISOString().split('T')[0]; // Return the date in "YYYY-MM-DD" format
  };
  
  // Example usage:
  const date = new Date("2014-06-20");
  console.log(date.nextDay()); // Output: "2014-06-21"
  
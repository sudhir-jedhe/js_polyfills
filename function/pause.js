function pause(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

// Example usage:

async function main() {
  console.log("Start");
  await pause(1000); // Pause for 1 second
  console.log("Resume");
}

main();

// Implement a js function that pauses for a specified duration before resuming execution

// This function uses the setTimeout() function to schedule a callback function
// to be executed after a specified delay. The Promise object is used to ensure
// that the calling function waits for the delay to expire before resuming
// execution. To use the pause() function, simply pass the desired delay in
// milliseconds as an argument. For example, to pause for 1 second, you would
// pass 1000 as the argument. The pause() function can be used to pause the
// execution of any asynchronous operation. For example, you could use it to
// pause the execution of an animation, or to pause the execution of a network
// request.

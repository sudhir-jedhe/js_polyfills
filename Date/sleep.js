const delay = (fn, ms, ...args) => setTimeout(fn, ms, ...args);

const greet = (name) => console.log(`Hello ${name}!`);
delay(greet, 300, 'world');
// Logs: Hello world! (after 300ms)

/********************************************** */
const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));
  
  const greet = async () => {
    console.log('I will be with you in just a moment.');
    await sleep(300);
    console.log('Hello there!');
  };
  greet();
  // Logs: I will be with you in just a moment.
  // Logs: Hello there! (after 300ms)
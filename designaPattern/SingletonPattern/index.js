let counter = 0;

// 1. Create an object containing the `getCount`, `increment`, and `decrement` method.
const connection = (url) =>
  Object.freeze({
    url,
    connect: () => {
      console.log(`DB ${url} connected`);
    },
    disconnect: () => {
      console.log(`DB ${url} disconnected`);
    },
  });

// 2. Freeze the object using the `Object.freeze` method, to ensure the object is not modifiable.
// const singletonCounter = Object.freeze(counterObject);

// 3. Export the object as the `default` value to make it globally accessible.
const connection1 = connection("mongodb://...");
export default connection;

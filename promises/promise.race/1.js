function race(arr) {
  // write your code here

  return new Promise((resolve, reject) => {
    for (const promise of arr) {
      promise
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

Promise.race = race;

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"

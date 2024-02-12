function race(arr) {
  // write your code here
  return new Promise((res, rej) => {
    arr.forEach((prom) => {
      prom.then(
        (result) => res(result),
        (reject) => rej(reject)
      );
    });
  });
}

Promise.race = race;

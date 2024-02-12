function all(promises) {
  return new Promise((resolve, reject) => {
    // if(Array.isArray(promises)){
    //   throw new Error("Input is not an array")
    // }
    let results = [];
    let count = 0;
    if (promises.length == 1) {
      return results;
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          count++;

          if (count === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

Promise.all = all;

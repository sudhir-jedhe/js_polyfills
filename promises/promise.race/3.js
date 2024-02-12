function race(arr) {
  return new Promise((resolve, reject) => {
    for (let promise of arr) {
      (async function () {
        try {
          const value = await promise;
          resolve(value);
        } catch (e) {
          reject(e);
        }
      })();
    }
  });
}

Promise.race = race;

/*************************User Implement custom promise.all ************************ */

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        reject(new TypeError("Promises must be provided as an array."));
        return;
      }
  
      const results = [];
      let completedPromises = 0;
  
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then((result) => {
            results[index] = result;
            completedPromises++;
  
            if (completedPromises === promises.length) {
              resolve(results);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
  
      // If the input array is empty, resolve immediately
      if (promises.length === 0) {
        resolve(results);
      }
    });
  }
  
  // Example usage:
  
  const promise1 = new Promise((resolve) =>
    setTimeout(() => resolve("Promise 1 resolved"), 1000)
  );
  const promise2 = new Promise((resolve) =>
    setTimeout(() => resolve("Promise 2 resolved"), 500)
  );
  const promise3 = new Promise((resolve) =>
    setTimeout(() => resolve("Promise 3 resolved"), 200)
  );
  
  promiseAll([promise1, promise2, promise3])
    .then((results) => {
      console.log("Resolved:", results);
    })
    .catch((error) => {
      console.log("Rejected:", error);
    });
  /********************************************* */

    const p1 = new Promise((resolve) => setTimeout(resolve, 100, 100));
const p2 = new Promise((resolve) => setTimeout(resolve, 300, 200));
const p3 = new Promise((resolve) => setTimeout(resolve, 500, 300));

const promises = [p1, p2, p3];

Promise.all(promises).then((data) =>
    console.log(data.reduce((total, next) => total + next)));

console.log('finished');

/****************************************************************************** */
const axios = require('axios');

async function makeRequests(urls) {

    const fetchUrl = (url) => axios.get(url);
    const promises = urls.map(fetchUrl);

    let responses = await Promise.all(promises);

    responses.forEach(resp => {

        let msg = `${resp.config.url} -> ${resp.headers.server}: ${resp.status}`;
        console.log(msg);
    });
}

let urls = [
    'http://webcode.me',
    'https://example.com',
    'http://httpbin.org',
    'https://clojure.org',
    'https://fsharp.org',
    'https://symfony.com',
    'https://www.perl.org',
    'https://www.php.net',
    'https://www.python.org',
    'https://code.visualstudio.com',
    'https://github.com'
];

makeRequests(urls);
/****************************************************************************** */
const axios = require("axios");

async function makeRequests(urls) {
  const fetchUrl = (url) => axios.get(url);
  const promises = urls.map(fetchUrl);

  let responses = await Promise.all(promises);

  responses.forEach((resp) => {
    let msg = `${resp.config.url} -> ${resp.headers.server}: ${resp.status}`;
    console.log(msg);
  });
}

let urls = [
  "http://webcode.me",
  "https://example.com",
  "http://httpbin.org",
  "https://clojure.org",
  "https://fsharp.org",
  "https://symfony.com",
  "https://www.perl.org",
  "https://www.php.net",
  "https://www.python.org",
  "https://code.visualstudio.com",
  "https://github.com",
];

makeRequests(urls);

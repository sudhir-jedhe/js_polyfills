// enable myCookie
function useCustomCookie() {
  // to store the key and value
  // of each cookie
  const store = new Map();

  Object.defineProperty(document, "myCookie", {
    configurable: true,
    get() {
      const cookies = [];
      const time = Date.now();

      // get all the entries from the store
      for (const [name, { value, expires }] of store) {
        // if the entry is expired
        // remove it from the store
        if (expires <= time) {
          store.delete(name);
        }
        // else push the key-value pair in the cookies array
        else {
          cookies.push(`${name}=${value}`);
        }
      }

      // return all the key-value pairs as a string
      return cookies.join("; ");
    },

    set(val) {
      // get the key value of the data
      // and option from the string
      const { key, value, options } = parseCookieString(val);

      // if option has max-age
      // set the expiry date
      let expires = Infinity;
      if (options["max-age"]) {
        expires = Date.now() + Number(options["max-age"]) * 1000;
      }

      // add the entry in the store
      store.set(key, { value, expires });
    },
  });
}

Input: useCustomCookie();
document.myCookie = "blog=learnersbucket";

// this will expire after 1 second
document.myCookie = "name=prashant;max-age=1";

console.log(document.myCookie);

setTimeout(() => {
  console.log(document.myCookie);
}, 1500);

Output: "blog=learnersbucket; name=prashant";
("blog=learnersbucket");

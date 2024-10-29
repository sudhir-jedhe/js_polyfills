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


/***************************** */



// enable myCookie
function install() {
  // Map<string, {value: string, maxAge?: number, createdAt: number}>
  const store = new Map()
  // use getter and setter
  Object.defineProperty(document, 'myCookie', {
    get() {
      const result = []
      for (let [key, entry] of store.entries()) {
        if (entry.maxAge !== undefined) {
          if (Date.now() - entry.createdAt >= entry.maxAge) {
            // expire
            store.delete(key)
            continue
          }
        }
        result.push(`${key}=${entry.value}`)
      }
      return result.join('; ')
    },
    
    set(valueStr) {
      const [keyValuePair,...options] = valueStr.replace(/ /g, '').split(';')
      const [key, value] = keyValuePair.split('=')
      if (!key || !value) return
      
      const entry = {
        value,
        createdAt: Date.now()
      }
      
      options.forEach((option) => {
        const [key, value] = option.split('=')
        if (!key || !value) return
        
        if (key === 'max-age') {
          const maxAge = parseInt(value, 10)
          
          if (Number.isNaN(maxAge)) return
          entry.maxAge = maxAge * 1000
        }
      })
      
      store.set(key, entry)
    },
    
    configurable: true
  })
}
// disable myCookie
function uninstall() {
  delete document.myCookie
}
// Implement a function in JavaScript that caches the API response for the given amount of time. If a new call is made between that time, the response from the cache will be returned, else a fresh API call will be made.

const call = cachedApiCall(1500);

// first call
// an API call will be made and its response will be cached
call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
//"making new api call"
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/

// cached response will be returned
// it will be quick
setTimeout(() => {
  call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
}, 700);
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/

// a fresh API call is made
// as time for cached entry is expired
setTimeout(() => {
  call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
}, 2000);
//"making new api call"
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/


// We can implement this function by forming a closure. The outer function will accept the time and return an async inner function, that will accept the arguments to make the API call.

// In the inner function, we will create a new unique key from the arguments to cached value.

// Using this key, get the entry from the cache. If there is no entry present or the time of the entry is expired, make a new API call. Else return the value of the entry.

// To generate the key and make the API call we will be using two helper functions.

// helper function to create a key from the input
const generateKey = (path, config) => {
    const key = Object.keys(config)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => k + ":" + config[k].toString())
      .join("&");
    return path + key;
  };



  // helper function to make api call
const makeApiCall = async (path, config) => {
    try{
      let response = await fetch(path, config);
      response = await response.json();
      return response;
    }catch(e){
      console.log("error " + e);
    }
    
    return null;
  };


  const cachedApiCall = (time) => {
    // to cache data
    const cache = {};
    
    // return a new function
    return async function(path, config = {}) {
      // get the key
      const key = generateKey(path, config);
      
      // get the value of the key
      let entry = cache[key];
    
      // if there is no cached data
      // or the value is expired
      // make a new API call
      if(!entry || Date.now() > entry.expiryTime){
        console.log("making new api call");
        
        // store the new value in the cache
        try {
          const value = await makeApiCall(path, config)
          cache[key] = { value, expiryTime: Date.now() + time };
        }catch(e){
         console.log(error); 
        }
      }
      
      //return the cache
      return cache[key].value;
    }
  };


  const call = cachedApiCall(1500);

// first call
// an API call will be made and its response will be cached
call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
//"making new api call"
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/

// cached response will be returned
// it will be quick
setTimeout(() => {
  call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
}, 700);
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/

// a fresh API call is made
// as time for cached entry is expired
setTimeout(() => {
  call('https://jsonplaceholder.typicode.com/todos/1', {}).then((a) => console.log(a));
}, 2000);
//"making new api call"
/*
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
*/
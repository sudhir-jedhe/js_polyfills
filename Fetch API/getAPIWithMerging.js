// getAPI is bundled with your code, config will only be some plain objects.
// const getAPI = <T>(path: string, config: SomeConfig): Promise<T> => { ... }
// you code here maybe, if you want some outer scope.
// Map<string, {promise: Promise, triggered: number}>
const cache = new Map()
const hash = (obj) => {
  switch (Object.prototype.toString.call(obj)) {
    case '[object Null]':
      return 'null'
    case '[object Undefined]':
      return 'undefined'
    case '[object Number]':
    case '[object Boolean]':
      return obj.toString()
    case '[object String]':
      return obj
    case '[object Object]':
      const keys = Object.keys(obj)
      keys.sort()
      return `{${keys.map(key => `"${key}":${hash(obj[key])}`).join(',')}}`
      case '[obect Array]':
      return `[${obj.map(item => hash(item)).join(',')}]`   
  }
}
const MAX_CACHE = 5
const CACHE_TIME_LIMIT = 1000
/**
 * @param { string } path
 * @param { object } config
 * only plain objects, no strange input in this problem
 * @returns { Promise<any> }
 */
function getAPIWithMerging(path, config) {
  // serialize the hash, with path + config
  const requestHash = hash({path, config})
  
  // cache is available
  if (cache.has(requestHash)) {
    const entry = cache.get(requestHash)
    if (Date.now() - entry.triggered <= CACHE_TIME_LIMIT) {
      return entry.promise
    }
    cache.delete(requestHash)
  }
  
  const promise = getAPI(path, config)
  cache.set(requestHash, {
    promise,
    triggered: Date.now()
  })
  
  // remove the oldest cache
  if (cache.size > MAX_CACHE) {
    for (let [hash] of cache) {
      cache.delete(hash)
      break
    }
  }
  
  return promise
}
getAPIWithMerging.clearCache = () => {
   cache.clear()
}


/****************************************** */

const cache = new Map();
/**
 * @param {string} path
 * @param {object} config
 * only plain objects/array made up serializable primitives
 * @returns {Promise<any>}
 */
function getAPIWithMerging(path, config) {
  const key = getHashKey(path, config);
  const result = cache.get(key);
  if(result) {
    if(result.expiredAt > Date.now()) {
      return Promise.resolve(result.promise);
    }
    cache.delete(key);
  }
  const promise = getAPI(path, config);
  cache.set(key, { promise, expiredAt: Date.now() + 1000 })
  return promise;
}
getAPIWithMerging.clearCache = () => {
  cache.clear();
}
function getHashKey(path, config) {
  const arr = [path];
  const keys = Object.keys(config);
  keys.sort()
  for(let key of keys) {
    arr.push([key, config[key]]);
  }
  return JSON.stringify(arr);
}


/******************************** */

// getAPI is bundled with your code, config will only be some plain objects.
// const getAPI = <T>(path: string, config: SomeConfig): Promise<T> => { ... }
const apiCache = new Map()
function getAPIAndStoreInCache(path, config) {
  if (apiCache.size >= 5) {
    apiCache.delete(apiCache.keys().next().value) 
  }
  
  const key = hashConfig(path, config)
  const value = getAPI(path, config)
  
  apiCache.set(key, value)
  setTimeout(() => {
    apiCache.delete(key)
  }, 1000)
  
  return value
}
function hashConfig(path, config) {
  const keys = Object.keys(config).sort()
  return path + keys.map(key => `?${key}=${config[key]}`).join(`&`)
}
/**
 * @param {string} path
 * @param {object} config
 * only plain objects/array made up serializable primitives
 * @returns {Promise<any>}
 */
function getAPIWithMerging(path, config) {
  const cacheKey = hashConfig(path, config)
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }
  
  return getAPIAndStoreInCache(path, config)
}
getAPIWithMerging.clearCache = () => {
   // your code here
  apiCache.clear()
}



// Suppose we have a utility function getAPI() which fetches data.

// const getAPI = (path, config) => { ... }
// const list1 = await getAPI('/list', { keyword: 'bfe'})
// const list2 = await getAPI('/list', { keyword: 'dev'})
// It works great. Util the UI become so complicated that same API might be called for multiple time within a relatively short period of time.

// You want to avoid the unnecessary API calls, based on following assumption:

// GET API call response hardly changes within 1000ms.

// So identical GET API calls should return the same response within 1000ms. By identical, it means path and config are deeply equal.

// You create createGetAPIWithMerging(getAPI), which works like following.

// const getAPIWithMerging = createGetAPIWithMerging(getAPI)
// getAPIWithMerging('/list', { keyword: 'bfe'}).then(...)  
// // 1st call,  this will call getAPI
// getAPIWithMerging('/list', { keyword: 'bfe'}).then(...) 
// // 2nd call is identical to 1st call, 
// // so getAPI is not called, 
// // it resolves when 1st call resolves
// getAPIWithMerging('/list', { keyword: 'dev'}).then(...)
// // 3rd call is not identical, so getAPI is called
// // after 1000ms
// getAPIWithMerging('/list', {keyword: 'bfe'}).then(...)
// // 4th call is identical to 1st call, 
// // but since after 1000ms, getAPI is called.
// Attention for memory leak!
// Your cache system should not bloat. For this problem, you should have 5 cache entries at maximum, which means:

// getAPIWithMerging('/list1', { keyword: 'bfe'}).then(...) 
// // 1st call, call callAPI(), add a cache entry
// getAPIWithMerging('/list2', { keyword: 'bfe'}).then(...) 
// // 2nd call, call callAPI(), add a cache entry
// getAPIWithMerging('/list3', { keyword: 'bfe'}).then(...) 
// // 3rd call, call callAPI(), add a cache entry
// getAPIWithMerging('/list4', { keyword: 'bfe'}).then(...) 
// // 4th call, call callAPI(), add a cache entry
// getAPIWithMerging('/list5', { keyword: 'bfe'}).then(...) 
// // 5th call, call callAPI(), add a cache entry
// getAPIWithMerging('/list6', { keyword: 'bfe'}).then(...) 
// // 6th call, call callAPI(), add a cache entry
// // cache of 1st call is removed
// getAPIWithMerging('/list1', { keyword: 'bfe'}).then(...) 
// // identical with 1st call, but cache of 1st call is removed
// // new cache of entry is added
// clear()
// For test purpose, please provide a clear method to clear all cache.

// getAPIWithMerging.clearCache()

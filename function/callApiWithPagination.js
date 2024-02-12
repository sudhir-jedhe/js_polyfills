// Have you ever met some APIs with pagination, and needed to recursively fetch them based on response of previous request ?

// Suppose we have a /list API, which returns an array items.

// fetchList is provided for you
const fetchList = (since?: number) => 
  Promise<{items: Array<{id: number}>}>
// for initial request, we just fetch fetchList. and get the last item id from response.
// for next page, we need to call fetchList(lastItemId).
// repeat above process.
// The /list API only gives us 5 items at a time, with server-side filtering, it might be less than 5. But if none returned, it means nothing to fetch any more and we should stop.

// You are asked to create a function that could return arbitrary amount of items.

// const fetchListWithAmount = (amount: number = 5) { }
// note


// fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>


/**
 * Using async/await loop 
 */
async function fetchListWithAmount(amount = 5) {
    let cursor;
    const result = [];
  
    while (result.length < amount) {
      const { items } = await fetchList(cursor);
      if (items.length > 0) {
        result.push(...items);
        cursor = items[items.length - 1].id;
      } else {
        break;
      }
    }
    return result.slice(0, amount);
  }
  
  /**
   * Using async iterator 
   */
  async function fetchListWithAmount(amount = 5) {
    const result = [];
  
    for await (const nextItems of fetchListIterator()) {
      result.push(...nextItems);
    }
    return result.slice(0, amount);
  
    function fetchListIterator() {
      let totalAmountFetched = 0;
      let cursor;
  
      return {
        [Symbol.asyncIterator]() {
          return {
            async next() {
              const { items } = await fetchList(cursor);
              // If API is exhausted OR we reached desired amount -> stop
              if (items.length === 0 || totalAmountFetched > amount) {
                return { done: true };
              }
  
              totalAmountFetched += items.length;
              cursor = items[items.length - 1].id;
  
              return {
                done: false,
                value: items,
              }
            }
          };
        },
      };
    }
  }
  
  /**
   * Using async generator 
   */
  async function fetchListWithAmount(amount = 5) {
    const result = [];
  
    for await (const nextItems of fetchListGenerator()) {
      result.push(...nextItems);
    }
    return result.slice(0, amount);
  
    async function* fetchListGenerator() {
      let totalAmountFetched = 0;
      let cursor;
  
      while (totalAmountFetched < amount) {
        const { items } = await fetchList(cursor);
        if (items.length === 0) break;
        cursor = items[items.length - 1].id;
        totalAmountFetched += items.length;
        yield items;
      }
    }
  }
  
  /**
   * Using recursion and Promise
   */
  function fetchListWithAmount(amount = 5) {
    return new Promise((resolve) => {
      const result = [];
      getItems();
  
      function getItems(cursor) {
        fetchList(cursor).then(({ items }) => {
          result.push(...items);
          if (items.length === 0 || items.length >= amount) {
            return resolve(result.slice(0, amount));
          }
          getItems(items[items.length - 1].id);
        });
      }
    });
  }


  /*********************************************** */
  // fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>

// #1 recursion
const fetchListWithAmount = async (amount = 5) => {
    const result = [];
  
    return makeFetch();
    
    function makeFetch(id) {
      return fetchList(id).then(({ items }) => {
        result.push(...items);
        if(result.length >= amount || !items.length) {
          return result.slice(0, amount);
        }
        const { id: lastItemId } = result[result.length - 1];
        return makeFetch(lastItemId);
      });
    }
  }
  
  // #2 async/await loop 
  const fetchListWithAmount = async (amount = 5) => {
    const result = [];
  
    while(result.length <= amount) {
      const lastItem = result[result.length - 1];
      const { items } = await fetchList(lastItem?.id);
      result.push(...items);
      if (!items.length) {
        break;
      }
    }
  
    return result.slice(0, amount);
  }
  
  // #3 asyncIterator
  const fetchListWithAmount = async (amount = 5) => {
    const result = [];
    for await (const items of fetchListIterator()) {
      result.push(...items);
      if(result.length >= amount) break;
    }
    return result.slice(0, amount);
  }
  
  function fetchListIterator() {
    let lastItemId;
  
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        const { items } = await fetchList(lastItemId);
        if (items.length === 0) {
          return { done: true };
        }
  
        lastItemId = items[items.length - 1].id;
  
        return {
          done: false,
          value: items,
        }
      }
    }
  }
  
  
  // #4 generator
  const fetchListWithAmount = async (amount = 5) => {
    const result = [];
    for await (const items of fetchListGenerator()) {
      result.push(...items);
      if(result.length >= amount) break;
    }
    return result.slice(0, amount);
  }
  
  async function* fetchListGenerator() {
    let lastItemId;
  
    while(true) {
      const { items } = await fetchList(lastItemId);
      if (items.length === 0) {
        return { done: true };
      }
      lastItemId = items[items.length - 1].id;
      yield items;
    }
  }
  

  
  /************************************** */
  // fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>


// you can change this to generator function if you want

const fetchListWithAmount = async (amount = 5) => {
    //fetch only required amount
    //endpoint gives max 5 but can be less
    // if nothing return finish recursion
    // recursively call with id
    // store already fetched item
    // if we have required amount we finish recursion
    // or if there is nothing fetch finish recurstion
  
    const results = []
  
    async function makeRequestHelper(id) {
      if(results.length >= amount) return
  
      const {items} = await fetchList(id)
  
      if(!items.length) return
  
      results.push(...items) // [1,2,3].slice(0,20) [1,2,3]
      
      const lastId = results[results.length - 1].id
  
      await makeRequestHelper(lastId)
    }
  
    await makeRequestHelper()
  
    return results.slice(0, amount)
  
  //   function makeFetch(id) {
  //     return fetchList(id).then(({ }))
  //   }
  
  // return makeFetch()
  }
  
  console.log(fetchListWithAmount(5).then(res => console.log(res)))
// Have you ever met some APIs with pagination, and needed to recursively fetch them based on response of previous request ?

// Suppose we have a /list API, which returns an array items.

// // fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>
// for initial request, we just fetch fetchList. and get the last item id from response.
// for next page, we need to call fetchList(lastItemId).
// repeat above process.
// The /list API only gives us 5 items at a time, with server-side filtering, it might be less than 5. But if none returned, it means nothing to fetch any more and we should stop.

// You are asked to create a function that could return arbitrary amount of items.

// const fetchListWithAmount = (amount: number = 5) { }



/ fetchList is provided for you
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

/**************************** */


// fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>
// you can change this to generator function if you want
const fetchListWithAmount = async (amount = 5) => {
    // 1. create out generator function
    // 2. while(true) loop there which yield fetched items
    // 3. if no more items, return {done: true}
    // 4. for await ... of loop over that generator and push result to final array
    
    const finalResults = []
    for await(const item of fetchListGenerator()) {
      if(finalResults.length >= amount) break
      finalResults.push(...item)
    }
    return finalResults.slice(0, amount)
  }
  async function* fetchListGenerator() {
    let id
    while(true) {
      const { items } = await fetchList(id)
      if(!items.length) return {done: true}
      id = items[items.length - 1].id
      yield items
    }
  }
  
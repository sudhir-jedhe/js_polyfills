let items = [
    {color: 'red', type: 'tv', age: 18}, 
    {color: 'silver', type: 'phone', age: 20},
    {color: 'blue', type: 'book', age: 17}
  ] 
  
  // an exclude array made of key value pair
  const excludes = [ 
    {k: 'color', v: 'silver'}, 
    {k: 'type', v: 'tv'}, 
    ...
  ] 


//   function excludeItems(items, excludes) { 
//     excludes.forEach( pair => { 
//       items = items.filter(item => item[pair.k] === item[pair.v])
//     })
   
//     return items
//   } 

  function excludeItems(items, excludes) {
    return items.filter((item) =>
      excludes.every(({k, v}) => item[k] !== v)
    )
  }


  /**
 * @param {object[]} items
 * @excludes { Array< {k: string, v: any} >} excludes
 */

/**
 * @param {object[]} items
 * @param { Array< {k: string, v: any} >} excludes
 * @return {object[]}
 */

/*
1. excludeItems loop over every pair of "excludes" array, 
and filters out those items which have the pair.v corresponding to pair.k
However, since we are comparing with item[pair.v], 
since pair.v is supposed to be the value, and not the key, it won't work as intended.

2. No. If the intended input is given, item[pair.v] is incorrect because it is the value and not the key.
So, we are looking for the value among the keys.
Also, the function will INCLUDE those key-value pairs in excludes array, rather than excluding them. 
So, if this is NOT the intended behavior, then (item[pair.k] !== pair.v) will make it work as intended.

3. If the size of items array is M and excludes array is N, then:
time complexity = O(N*M)
space complexity (considering with garbage collection) = O(M)
*/

function excludeItems(items, excludes) {
    const store = new Map();   // Map<k: Set(v)>
    for(let {k, v} of excludes){
      if(!store.has(k)){
        store.set(k, new Set());
      }
      store.get(k).add(v);
    }
  
    return items.filter(x => {
      for(let key in x){
        if(store.has(key) && store.get(key).has(x[key])){
          return false;
        }
      }
      return true;
    })
  }
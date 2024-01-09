/***********************GroupBy******************** */
function groupBy(collection, iteratee) {
    return collection.reduce((result, item) => {
        const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
  
        if (!result[key]) {
            result[key] = [];
        }
  
        result[key].push(item);
  
        return result;
    }, {});
  }
  
  // Example usage:
  
  const data = [
    { id: 1, name: 'Alice', category: 'A' },
    { id: 2, name: 'Bob', category: 'B' },
    { id: 3, name: 'Charlie', category: 'A' },
    { id: 4, name: 'David', category: 'C' },
    { id: 5, name: 'Eva', category: 'B' },
  ];
  
  const groupedData = groupBy(data, 'category');
  
  console.log(groupedData);
  /*
  Output:
  {
    A: [ { id: 1, name: 'Alice', category: 'A' }, { id: 3, name: 'Charlie', category: 'A' } ],
    B: [ { id: 2, name: 'Bob', category: 'B' }, { id: 5, name: 'Eva', category: 'B' } ],
    C: [ { id: 4, name: 'David', category: 'C' } ]
  }
  */
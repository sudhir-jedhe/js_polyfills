const obj = {
    'e': 1,
    'c': 2,
    'b': 3,
    'd': 4,
    'a': 5
  };
  
  const objKeys = Object.keys(obj);
  
  const sortedKeys = objKeys.sort((a, b) => a > b);
  
  console.log(sortedKeys);
  // ["a","b","c","d","e"]


  const obj = {
    'e': 1,
    'c': 2,
    'b': 3,
    'd': 4,
    'a': 5
  };
  
  const objKeys = Object.keys(obj);
  
  const sortedKeys = objKeys.sort((a, b) => b > a);
  
  console.log(sortedKeys);
  //["e","d","c","b","a"]



  const obj = {
    2: 'a',
    4: 'b',
    1: 'c',
    3: 'd'
  };
  
  console.log(Object.keys(obj));
  // ["1","2","3","4"]


  const obj = {
    2: 'a',
    4: 'b',
    1: 'c',
    3: 'd'
  };
  
  console.log(obj);
  
  /*{
    "1": "c",
    "2": "a",
    "3": "d",
    "4": "b"
  }*/
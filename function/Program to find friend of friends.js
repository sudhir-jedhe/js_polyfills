Input:
const mapping = {
  a: ['b', 'c'],
  b: ['d', 'g'],
  d: ['p', 'q'],
  l: ['x', 'y']
};

console.log(friends(mapping, 'a'));

Output:
["b","c","d","g","p","q"]

// a -> [b, c]
// b -> [d, g]
// d -> [p, q]


const friends = (mapping, person) => {
    // get the friends list
    const friendsList = mapping[person];
    
    // if the friend's list exits
    if(friendsList) {
      // then get the list in the final output
      const output = [...friendsList];
      
      // iterate each friend of the list
      for(let entry of friendsList){
        // and if mutual friends for these friends exit
        // add them to the final list
       output.push(...friends(mapping, entry)); 
      }
      
      // return the final list
      return output;
    }
    
    // else return the empty list
    return [];
  }


  Input:
console.log(friends(mapping, 'a'));

Output:
["b","c","d","g","p","q"]
// Given an array with two entries, parent and child relation, convert the array to a relation tree object (parent -> child -> grandchild) in JavaScript.

// The input array will contain relations for many ancestries in random order, We must return the array of strings representing different relationships.


Input:
[
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]


const ancestry = (arr) => {

    // aggregate parent / child relation
    const aggregate = (arr) => {
  
      // aggregate the values for easier processing
      return arr.reduce((a, b) => {
        const [child, parent] = b;
  
        // aggregating on child
        a[child] = parent;
  
        return a;
      }, {});
    };
    
    // for a relationship from the aggregated value
    const convert = (obj) => {
      return Object.keys(obj).reduce((a, b) => {
        a.push(getKey(obj, b));
        return a;
      }, []);
    };
  
    // helper function to form the string
    // till the last hierarchy
    const getKey = (obj, key) => {
      // access the
      const val = obj[key];
  
      // the formation can be reversed by chaning the order of the keys
      // child -> parent | parent -> child
      if(val in obj){
        return getKey(obj, val) + " -> " + key;
      }else{
        return val + " -> " + key;
      }
    };
    
    // get the aggregated map
    const aggregatedMap = aggregate(arr);
    
    // return the ancestory 
    return convert(aggregatedMap);
  
  };


  Input:
const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

console.log(ancestry(arr));

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]
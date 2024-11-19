const getCircularReplacer = () => {
  //form a closure and use this
  //weakset to monitor object reference.
  const seen = new WeakSet();

  //return the replacer function
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

input: console.log(JSON.stringify(item1, getCircularReplacer()));

output: "{'next':{'next':{'val':30},'val':20},'val':10}";

/////////////******** */


const removeCycle = (obj) => {
    //set store
    const set = new WeakSet([obj]);
    
    //recursively detects and deletes the object references
    (function iterateObj(obj) {
        for (let key in obj) {
            // if the key is not present in prototye chain
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object'){
                    // if the set has object reference
                    // then delete it
                    if (set.has(obj[key])){ 
                      delete obj[key];
                    }
                    else {
                      //store the object reference
                        set.add(obj[key]);
                      //recursively iterate the next objects
                        iterateObj(obj[key]);
                    }
                }
            }
        }
    })(obj);
}

Input:
const List = function(val){
  this.next = null;
  this.val = val;
};

const item1 = new List(10);
const item2 = new List(20);
const item3 = new List(30);

item1.next = item2;
item2.next = item3;
item3.next = item1;

removeCycle(item1);
console.log(item1);

Output:
/*
{val: 10, next: {val: 20, next: {val: 30}}}
*/


/****************************************** */


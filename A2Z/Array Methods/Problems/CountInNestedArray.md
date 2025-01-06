let countInArray = function (inputArr, test) {
    //track the count
    let count = 0;
  
    const search = (arr, test) => {
      //iterate the array
      for (let a of arr) {
        //if not an array
        //test the element
        //if it passes the test, store its result
        if (test(a)) {
          count += 1;
        }
  
        //if sub-array
        if (Array.isArray(a)) {
          //recursively filter the sub-array
          search(a, test);
        }
      }
    };
  
    //search
    search(inputArr, test);
  
    //return
    return count;
  };


  Input:
const arr = [[1, [2, [3, 4, "foo", { a: 1, b: 2 }]], "bar"]];
const count = countInArray(arr, (e) => typeof e === "number");
console.log(count);

Output:
4


let countInArray = function (inputArr, test) {
    //track the count
    let count = 0;
  
    const search = (arr, test) => {
      //iterate the array
      for (let a of arr) {
        //if not an array
        //test the element
        //if it passes the test, store its result
        if (test(a)) {
          count += 1;
        }
  
        //if sub-array
        if (Array.isArray(a)) {
          //recursively filter the sub-array
          search(a, test);
        }
      }
    };
  
    //search
    search(inputArr, test);
  
    //return
    return count;
  };


  Input:
const arr = [[1, [2, [3, 4, "foo", { a: 1, b: 2 }]], "bar"]];
const count = countInArray(arr, (e) => typeof e === "number");
console.log(count);

Output:
4
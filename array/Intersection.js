// arr1 = [1, 3, 5, 7, 9, 10, 14, 15]
// arr2 = [1, 2, 3, 7, 10, 11, 13, 14]

// result_arr = [1, 3, 7, 10, 14]

// Approach 1:

// We will see the native approach to solving our problem statement which is how
// to create an array using the two arrays’ intersection values. This approach
// uses two simple for-loops which will run on both the arrays so created
// earlier and an if-statement which checks the values of both arrays. After
// checking the values from both arrays, we will actually push the values into
// the new array and return the array from the function, and later display the
// result over the browser’s console.

let first_array = [1, 3, 5, 7, 9];
let second_array = [2, 3, 4, 5, 6, 9];

let res_arr = (first_array, second_array) => {
  let new_array = [];
  for (let i = 0; i < first_array.length; i++) {
    for (let j = 0; j < second_array.length; j++) {
      if (first_array[i] === second_array[j]) {
        new_array.push(first_array[i]);
      }
    }
  }
  return new_array;
};

console.log("Array obtained is :");
console.log(res_arr(first_array, second_array));

// Approach 2:

// In this approach, we will try to visualize a better approach as compared to
// what we have witnessed in the previous example and we will try to avoid the
// extra overhead so required previously. In this example, we will use the
// filter() method as well as the includes() method of Arrays in JavaScript
// which will eventually filter elements based on their inclusion in both the
// arrays themselves. Later after filtering the elements from both arrays, we
// will display the array as output in the console.

let first_array = [1, 3, 5, 7, 9];
let second_array = [2, 3, 4, 5, 6, 9];

let new_array = first_array.filter((element) => second_array.includes(element));

console.log("Array obtained is :");
console.log(new_array);

// Approach 3:

// In this approach, we will look into another approach which is the usage of
// Set in JavaScript. Here, we will convert our two arrays into the sets and
// then use simple one for-loop and one if-statement. We will check the values
// of the two sets themselves and then similar values will be pushed into the
// new array itself. That new array will be returned from a function and will be
// printed in the browser’s console as output.

let res_arr = (arr1, arr2) => {
  let first_array_set = new Set(arr1);
  let second_array_set = new Set(arr2);
  let new_array = [];
  for (let element of second_array_set) {
    if (first_array_set.has(element)) {
      new_array.push(element);
    }
  }
  return new_array;
};

let first_array = [1, 3, 5, 7, 9];
let second_array = [2, 3, 4, 5, 6, 9];

console.log("Array obtained is: ");
console.log(res_arr(first_array, second_array));


/******************************* */
// intersection of unsorted arraye
function getIntersection(arr1, arr2) {
  let a = new Set(arr1);
  let b = new Set(arr2);
  return [...a].filter(a => b.has(a));
}

let arr1 = [1, 3, 5, 7, 9]; 
let arr2 = [2, 3, 4, 5, 6, 9];

console.log(getIntersection(arr1, arr2));

/*************************** */
function getIntersection(arr1, arr2) {
  const op = new Set();
  const map = {};
  for(let i of arr1) map[i] = true;
  for(let i of arr2) if(map[i]) op.add(i)
  return [...op]
}


function getIntersection(arr1, arr2) {
  return arr1.reduce((res, elem) => {
    if(arr2.includes(elem) && !res.includes(elem)) res.push(elem);
    return res;
  }, []);
}

function getIntersection(arr1, arr2) {
  // your code here
  let finalRes = [];
  for (let x of arr1) {
    if (arr2.includes(x)) {
      !finalRes.includes(x) && finalRes.push(x)
    }
  }
  return finalRes;
}

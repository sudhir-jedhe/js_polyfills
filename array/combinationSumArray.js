const combinationSum = (arr, target) => {
    //Track the current sub-array
    let temp = [];
    //Store the fincal result
    let result = [];
    //Track the current sum
    let sum = 0;
    //Track the index
    let index = 0;
    
    const backtrack = (temp, sum, index) => {
      //If current sum is greater than target then terminate the execution
      if(sum > target){
        return;
      }
      
      //If current sum is equal to the target then store the sub-array
      if(sum === target){
        result.push([...temp]);
        return;
      }
      
      //Backtrack all the possible combinations after the current index to get only unique combinations
      for(let i = index; i < arr.length; i++){
        temp.push(arr[i]);
        backtrack(temp, sum + arr[i], i);
        temp.pop();
      }
    }
    
    //Initiate the backtracking
    backtrack(temp, sum, index);
    
    //Return the result
    return result;
  }


  Input:
const arr = [2, 3, 6, 7];
const target = 7;
console.log(combinationSum(arr, target));

Output:
[[2, 2, 3], [7]]


Input:
arr = [2, 3, 5];
target = 8;

Output:
[
  [2, 2, 2, 2],
  [2, 3, 3],
  [3, 5]
]


const combinationSum = (arr, target) => {
    //Track the current sub-array
    let temp = [];
    //Store the fincal result
    let result = [];
    //Track the current sum
    let sum = 0;
    //Track the index
    let index = 0;
    
    const backtrack = (temp, sum, index) => {
      //If current sum is greater than target then terminate the execution
      if(sum > target){
        return;
      }
      
      //If current sum is equal to the target then store the sub-array
      if(sum === target){
        result.push([...temp]);
        return;
      }
      
      //Backtrack all the possible combinations to get only duplicate combinations
      for(let i = 0; i < arr.length; i++){
        temp.push(arr[i]);
        backtrack(temp, sum + arr[i], i);
        temp.pop();
      }
    }
    
    //Initiate the backtracking
    backtrack(temp, sum, index);
    
    //Return the result
    return result;
  }


  Input:
const arr = [2, 3, 5];
const target = 8;
console.log(combinationSum(arr, target));

Output:
[[2, 2, 2, 2], [2, 3, 3], [3, 2, 3], [3, 3, 2], [3, 5], [5, 3]]
// // N meetings in one room

// Given one meeting room and start and finish time of N meetings in two separate arrays we have to find the maximum number of meetings that can be accommodated in that room.

Input:
start = [1, 3, 0, 5, 8, 5]
finish = [2, 4, 6, 7, 9, 9]

Output:
4
First meeting: [1, 2]
Second meeting: [3, 4]
Third meeting: [5, 7]
Fourth meeting: [8, 9]


// We are going to see two different solutions based on different scenarios.

// 1. Start and Finish time of meetings are given in separate arrays and we have to return the indexes of the meetings accommodated.

// 2. Start and Finish time is given in the 2d array we have to just return the count.

// Scenario 1: N meetings in one room
// We can solve this problem using the greedy approach.

// Conceptually this is how it will work.

// Create a pair of each meeting with start and finish time and their index.
// Sort the meetings in increasing order of finish time of each pair.
// Select first meeting of sorted meetings as the first Meeting in the room and push it into result array and set a variable timeLimit with the finish time of the first selected meeting.
// Iterate all the meetings start from the second one and if the start time of current meeting is greater than finish time of last meeting then add its index in the result and update the timeLimit as the finish time of the current.
// Return the array size or whole array depending upon the need.

//Create meeting pair object
const meetPair = (start, end, index) => ({
    start, end, index
  }); 
  
  const maxMetting = (arr, n) => {
     //Sort the meeting based on the finish time in descending order
     arr.sort((a, b) => {
       if(a.end < b.end){
         return -1;
       }else if(a.end > b.end){
         return 1;
       }else{
         return 0;
       }
     });
    
    //To track the result
    const result = [];
    result.push(arr[0].index);
     
    //Track the finish time of current meeting
    let timeLimit = arr[0].end;
    
    //Iterate all the meetings
     for(let i = 1; i < arr.length; i++){
       //If meeting is not overlapping with previous meeting then push it in the result
       if(arr[i].start > timeLimit){
         result.push(arr[i].index);
         timeLimit = arr[i].end;
       }
     }
    
    return result;
   }

   Input:
// Starting time 
const s = [1, 3, 0, 5, 8, 5];
     
// Finish time 
const f = [2, 4, 6, 7, 9, 9];  
 
const meeting = [];
for(let i = 0; i < s.length; i++){
  meeting.push(meetPair(s[i], f[i], i));
}

console.log(maxMetting(meeting).length);

Output:
4
//[0, 1, 3, 4]


Scenario 2: When input is given as nested array.

// In this case we can sort the array based on the last index of each nested array and then use it to compare with each other to check if it is possible to conduct meeting or not.

const maxMetting = (arr, n) => {
    //Sort the meeting based on the finish time in descending order
    arr.sort((a, b) => {
      if(a[1] < b[1]){
        return -1;
      }else if(a[1] > b[1]){
        return 1;
      }else{
        return 0;
      }
    });
   
   //To track the result
   const result = [];
   result.push(arr[0]);
    
   //Track the finish time of current meeting
   let timeLimit = arr[0][1];
   
   //Iterate all the meetings
    for(let i = 1; i < arr.length; i++){
      //If meeting is not overlapping with previous meeting then push it in the result
      if(arr[i][0] > timeLimit){
        result.push(arr[i]);
        timeLimit = arr[i][1];
      }
    }
   
   return result;
  }

  Input:
const meeting = [[1, 2], [3, 4], [0, 6], [5, 7], [8, 9], [5, 9]];
console.log(maxMetting(meeting));

Output:
4
//[[1, 2], [3, 4], [5, 7], [8, 9]]
const rotateMatrixClockWise = (arr, N = arr.length) => {
    for(let x = 0; x < N / 2; x++){
      for(let y = x; y < N - x - 1; y++){
 
        //Store the left value and start the rotation from here
        let temp = arr[x][y];
 
        // Move values from left to top 
        arr[x][y] = arr[N - 1 - y][x];
 
        // Move values from top to right 
        arr[N - 1 - y][x] = arr[N - 1 - x][N - 1 - y];
 
        // Move values from right to bottom 
        arr[N - 1 - x][N - 1 - y] = arr[y][N - 1 - x];
 
        // Move values from bottom to left 
        arr[y][N - 1 - x] = temp;
      }
    }
   
   return arr;
 }



 Input: 
const arr = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
console.log(rotateMatrixClockWise(arr));

Output:
[[13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3], [16, 12, 8, 4]]


/****************************** */


 const rotateMatrixAntiClockWise = (arr, N = arr.length) => {
    for(let x = 0; x < N / 2; x++){
      for(let y = x; y < N - x - 1; y++){
 
        //Store the right value and start the rotation from here
        let temp = arr[x][y];
        
        // Move values from right to top 
        arr[x][y] = arr[y][N - 1 - x];
 
        // Move values from bottom to right 
        arr[y][N - 1 -x] = arr[N - 1 - x][N - 1 - y];
  
        // Move values from left to bottom 
        arr[N - 1 - x][N - 1 - y] = arr[N - 1 -y][x];
 
        // Assign temp to left 
        arr[N - 1 - y][x] = temp;
      }
    }
   
   return arr;
 }



 Input: 
const arr = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
console.log(rotateMatrixClockWise(arr));

Output:
[[4, 8, 12, 16], [3, 7, 11, 15], [2, 6, 10, 14], [1, 5, 9, 13]]
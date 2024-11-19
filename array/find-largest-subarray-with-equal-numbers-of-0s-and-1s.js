Input:
[0,0,1,0,0,0,1,1]
[0,1,1,0,1,1,1,0]

Output:
6  //100011
4  //0110


const solution = (arr) => {
    let max = 0;
    for(let i = 0; i < arr.length; i++){
          //To track the count
          let count = {
            0: 0,
            1: 0
          };
          
          for(let j = i; j < arr.length; j++){
            //Increase the count of the respective number
            count[arr[j]]++;
            
            if(count[0] === count[1]){
              max = Math.max(max, count[0] * 2);
            }
          }
      }
    
    return max;
  }


  const solution = (arr) => {
    let hM = new Map();
    let sum = 0;
    let max_len = 0;
    let end_index = -1;    
    let n = arr.length;
    
    //Change all 0's to -1
    for(let i = 0; i < n; i++){
        arr[i] = arr[i] === 0 ? -1 : 1;
    }
    
    for(let i = 0; i < n; i++){
        //Cumulate the sum
        sum += arr[i];
        
        //If sum is 0 then there are equal numbers of -1 and 1 so store the length
        if(sum === 0){
            max_len = i + 1;
            end_index = i;
        }
        
        //Check if the current sum is already present
        //If yes then from last index till current index the sum is 0
        //Which means there are equal no of -1 and 1.
        if(hM.has(sum + n)){
            if (max_len < i - hM.get(sum + n)) { 
                //store the length from last index to current
                max_len = i - hM.get(sum + n); 
                end_index = i; 
            } 
        }else{
            //Store the sum and its index
            hM.set(sum+n, i);
        }
    }
    
    //Return max length
    return max_len; 
};


Input:
console.log(solution([0,0,1,0,0,0,1,1]));
console.log(solution([0,1,1,0,1,1,1,0]));

Output:
6
4
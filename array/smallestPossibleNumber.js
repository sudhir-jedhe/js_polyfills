Input:
55010
7652634

Output:
10055
2345667

// Note: Transformed number should not start with 0 if it has atleast one non-zero character.


function smallestPossibleNumber(num){
    //Create a character array and sort it
    let sorted = num.split('').sort();
    
    //Check if first character is not 0 then join and return it
    if(sorted[0] != '0'){
       return sorted.join('');
    }
    
    //find the index of the first non - zero character
    let index = 0;
    for(let i = 0; i < sorted.length; i++){
       if(sorted[i] > "0"){
         index = i;
         break;
       }
    }
    
    //Swap the indexes
    let temp = sorted[0];
    sorted[0] = sorted[index];
    sorted[index] = temp;
   
    //return the string after joining the characters of array
    return sorted.join('');
  }


  Input:
console.log(smallestPossibleNumber('55010'));
console.log(smallestPossibleNumber('7652634'));
console.log(smallestPossibleNumber('000001'));
console.log(smallestPossibleNumber('000000'));

Output:
10055
2345667
100000
000000
/*How it works
  let sorted = num.split('').sort(''); = ['5','5','0','1','0'].sort() = ['0','0','1','5','5']
  if(sorted[0] != '0'){   // '0' != '0' condition fails
     return sorted.join('');
  }
  
  //Find the index of the first non - zero character
  let index = 0;
  for(let i = 0; i < sorted.length; i++){
     if(sorted[i] > '0'){  // '1' > '0'
       index = i;      // index = 2;
       break;          // break;
     }
  }
  
  //swap the index
  var temp = sorted[0];      
  sorted[0] = sorted[index];
  sorted[index] = temp;
  
  //return the string
  return sorted.join('');
*/



function smallestPossibleNumber(num) { 
    // initialize frequency of each digit to Zero
    let freq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
       
    // count frequency of each digit in the number
    while (num > 0){ 
      let d = parseInt(num % 10); // extract last digit
      freq[d]++; // increment counting
      num = parseInt(num / 10); //remove last digit
    } 
 
    // Set the LEFTMOST digit to minimum expect 0
    let result = 0; 
    for (let i = 1 ; i <= 9 ; i++) { 
       if (freq[i] != 0) { 
          result = i; 
          freq[i]--; 
          break;
       } 
    } 
        
    // arrange all remaining digits
    // in ascending order
    for (let i = 0 ; i <= 9 ; i++) {
       while (freq[i]-- != 0){ 
          result = result * 10 + i; 
       }
    }
       
   return result; 
 } 


 Input:
console.log(smallestPossibleNumber('55010'));
console.log(smallestPossibleNumber('7652634'));
console.log(smallestPossibleNumber('000001'));
console.log(smallestPossibleNumber('000000'));

Output:
10055
2345667
1
0
/* How it works
   // initialize frequency of each digit to Zero
   let freq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
   
   // count frequency of each digit in the number
   while (num > 0){ 
     let d = parseInt(num % 10); // extract last digit
     freq[d]++; // increment counting        
     num = parseInt(num / 10); //remove last digit
   } 
   //After incrementing count
   //freq = [2, 1, 0, 0, 0, 2, 0, 0, 0, 0]
   
   // Set the LEFTMOST digit to minimum expect 0
   let result = 0; 
   for (let i = 1 ; i <= 9 ; i++) { 
      if (freq[i] != 0) { 
         result = i; 
         freq[i]--; 
         break;
      } 
   } 
   // result = 1
  
   // arrange all remaining digits
   // in ascending order
   for (let i = 0 ; i <= 9 ; i++) {
      while (freq[i]-- != 0){ 
         result = result * 10 + i; 
      }
   }

   //10
   //100
   //1005
   //10055
   //10055
   
   return result
*/
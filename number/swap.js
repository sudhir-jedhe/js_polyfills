//function to swap to numbers without any temp variable
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);
    b = b - a;
    a = a + b;
    b = a - b;
    console.log('After swapping a = '+a+' and b = '+b);
  }

  Input:
swapNumbers(10, 15);

Output:
//How this works
/*Step 1*/ b = b - a = 15 - 10 = 5. /*So b = 5*/ 
/*Step 2*/ a = a + b = 10 + 5 = 15. /*So a = 15*/ 
/*Step 3*/ b = a - b = 15 - 5 = 10. /*So b = 10*/ 

Before swapping a = 10 and b = 15
After swapping a = 15 and b = 10



// Using logical operations
// Implementation
// We are going to solve this problem using bitwise XOR, XOR returns 1 if two bits are different i.e 1 ^ 0 will return 1, same bits will return 0.
// We are going to perform logical XOR on a and b and store it in a, a = a ^ b
// Then we are going to perform XOR on a and b and store it in b, b = a ^ b
// And in the end we are going to perform XOR on a and b and store it in a, a = a ^ b

//function to swap to numbers without any temp variable
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    console.log('After swapping a = '+a+' and b = '+b);
  }

  Input:
swapNumbers(10, 15);

Output:
//How this works
/*Step 1*/ a = a ^ b = 00001111 ^ 00001010 = 00000101 = 5. /*So a = 5*/ 
/*Step 2*/ b = a ^ b = 00000101 ^ 00001010 = 00001111 = 15. /*So b = 15*/ 
/*Step 3*/ a = a ^ b = 00000101 ^ 00001111 = 00001010 = 10. /*So a = 10*/ 

Before swapping a = 10 and b = 15
After swapping a = 15 and b = 10



//function to swap to numbers without any temp variable
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);
    [a, b] = [b, a];
    console.log('After swapping a = '+a+' and b = '+b);
  }
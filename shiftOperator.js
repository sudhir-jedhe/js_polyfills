/**Left Shift  32 bit */
let x = 7; // 00000000000000000000000000000111

x <<= 2; // 00000000000000000000000000011100

console.log(x); // 28

let x = 1; // 00000000000000000000000000000001
x <<= -1; // -10000000000000000000000000000000

console.log(x); //-2147483648

let a = 10; // 00000000000000000000000000001010
let b = 5; // 00000000000000000000000000000101
a = a << b; // 00000000000000000000000101000000

console.log(a);

/***************RightShift*********************** */
// Zero-fill right shift (>>>) operator
Input:
A = 6 ( 00000000000000000000000000000110 )
B = 1 ( 00000000000000000000000000000001 )

Output:
A >>> B = 3 ( 00000000000000000000000000000011 )

console.log("For non negative number:<br>");
let a = 12;

// Shift right two bits
let b = 2;
console.log("a = " + a + " , b = " + b);
console.log("<br>a >>> b = " + (a >>> b) + '<br>');

console.log("<br>For negative number:<br>");
let a = -10;

// Shift right two bits
let b = 3;
console.log("a = " + a + " , b = " + b);
For non negative number:
a = 12 , b = 2
a >>> b = 3
For negative number:
a = -10 , b = 3


/************************Bitwise AND Assignment *****************************/
// a &= b 
// Or
// a = a & b

let x = 7;	 // 00000000000000000000000000000111 
x &= 3;		 // 00000000000000000000000000000011 

console.log(x); //3


let x = 7; 
let y = 3; 
x &= y; 
console.log(x);  // 3

x &= 0; 
console.log(x); //0



/*******************************AND(&) Bitwise Operator */

// A	B	OUTPUT ( A & B )
// 0	0	0
// 0	1	0
// 1	0	0
// 1	1	1
let a = 5; 
let b = 3; 
console.log(a&b);


function checkOddOrEven(n) { 
	if(n&1 == 1) { 
		return "Number is odd"; 
	} 
	return "Number is even"; 
} 

console.log(checkOddOrEven(123)); 
console.log(checkOddOrEven(246));


/*********************OR(|) Bitwise Operator*********************** */
// A	B	OUTPUT ( A | B )
// 0	0	0
// 0	1	1
// 1	0	1
// 1	1	1

let a=3; 
let b=5; 
console.log(a|b);


let a=24; 
let b=45; 
console.log(a|b);

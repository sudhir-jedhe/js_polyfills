function reverseInteger(x) {
    const isNegative = x < 0;
    let reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''), 10);
    
    // Handle overflow as per 32-bit signed integer range
    if (reversed > Math.pow(2, 31) - 1) {
        return 0;
    }
    
    // Restore the sign
    return isNegative ? -reversed : reversed;
}

// Example usage:
console.log(reverseInteger(123)); // Output: 321
console.log(reverseInteger(-123)); // Output: -321
console.log(reverseInteger(120)); // Output: 21 (leading zero dropped)
console.log(reverseInteger(1534236469)); // Output: 0 (overflow check)


function reverseInt(number) {
    var isNegative = number < 0 ? true : false; 
    if(isNegative)
         number = number * -1; 
    var reverse = 0, lastDigit = 0; 
    while (number >= 1) {
         reverse = Math.floor(reverse * 10 + (number % 10)); 
         number = number / 10;
    } 
    return isNegative == true ? reverse*-1 : reverse;
}

console.log(reverseInt(-500)); // -5
console.log(reverseInt(501) // 105
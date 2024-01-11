//     accepts the words and spaces.
//      \w+\s

//  accepts the digits of length 1 or more.   \d+
var RE = /pattern/flags
// the pattern is the expression to match
// flags are g = global case , i = case-insensitive , m = multiline etc.

// Quantifier: It indicates the number of characters to match.
// n+ = one or more
// n* = zero or more

// Character Classes: These indicate kinds of characters like digits or letters.
/*   
   \d : digit
   \D : non-digit
   \w : alphabet
   \W : non-alphabet
*/
const re = new RegExp('a+b');


// formula = operand operator operand
// operand = [0-9]
// operator = [ – + * % ^ / ]

formula ='4-3+2+1'
const re = /^\d+([+-]\d+)*$/g; 
console.log(re.test(formula));  // true
// ^: Matches the beginning of input.
// \d: digit.
// x+: Matches the preceding item “x” 1 or more times.
// $: Matches the ending of input.
// [ ]: set of valid characters, The valid characters are the operators like plus, minus, etc.

formula ='4*5-3/2'
const re = /^\d+(?:[-+*/^]\d+)*$/g; 
console.log(re.test("4*5-3/2"));  // true

formula ='4-3*1/2'
const re = /^\d+([+-]\d+)*$/g; 
console.log(re.test("4-3*1/2"));  //false




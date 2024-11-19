Input:
let a = 3.14159265359;
let b = a.toFixed(2);
console.log(b);

Output:
"3.14"


Input:
Math.round(3.14159265359 * 100) / 100

Output:
3.14


let roundOff = (num, places) => {
    const x = Math.pow(10,places);
    return Math.round(num * x) / x;
  }


  Input:
console.log(roundOff(3.14159265359, 2));

output:
3.14
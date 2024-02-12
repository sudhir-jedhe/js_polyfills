pow(1, 2);
// 1

pow(2, 10);
// 1024

pow(4, -1);
// 0.25

var pow = function (a, b) {
  if (b == 0) return 1;
  if (b == 1) return a;
  if (b == -1) return 1 / a;
  if (b % 2 == 0) {
    let res = pow(a, b / 2);
    return res * res;
  } else {
    return a * pow(a, b - 1);
  }
};
/********************************* */
pow(2, 10)          = 32 * 32       = 1024
/
pow(2, 5)              = 4 * 4 * 2     = 32 (power is odd number so * 2 is needed)
/
pow(2, 2)                 = 2 * 2           = 4 
/
pow(2,1)                     = 2                = 2  (base case)
/**
 * @param {number} base
 * @param {number} power - integer
 * @return {number}
 */
function pow(base, power) {
  if (power < 0) {
    return 1 / powBinary(base, -power);
  }

  return powBinary(base, power);
}

function powBinary(base, power) {
  if (power === 0) return 1;
  if (power === 1) return base;

  const halfRes = pow(base, Math.floor(power / 2));
  return power % 2 == 0 ? halfRes * halfRes : halfRes * halfRes * base;
}



/*************************** */

/**
 * @param {number} base
 * @param {number} power - integer
 * @return {number}
 */
function pow(base, power){
    // your code here
    if (power === 0) return 1;
    if (base <= 1) return base;
    const p = power < 0 ? -1 * power : power;
    const value = power % 2 === 0 ? pow(base * base, p / 2) : pow(base * base, (p - 1) / 2) * base;
    return power < 0 ? 1 / value : value;
  }

  /********************************* */

  function pow(base, power){
    if(power === 0) return 1
    if(power === 1) return base
    if(power > 1){
      return base* pow(base, power -1)
    }else{
      return  1 / base* pow(base, power + 1)
    }
  }
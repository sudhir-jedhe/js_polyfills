// JavaScript provides both strict(===, !==) and type-converting(==, !=) equality comparison. The strict operators take type of variable in consideration, while non-strict operators make type correction/conversion based upon values of variables. The strict operators follow the below conditions for different types,

//    1. Two strings are strictly equal when they have the same sequence of characters, same length, and same characters in corresponding positions.
//    2. Two numbers are strictly equal when they are numerically equal, i.e., having the same number value.
//       There are two special cases in this,
//       1. NaN is not equal to anything, including NaN.
//       2. Positive and negative zeros are equal to one another.
//    3. Two Boolean operands are strictly equal if both are true or both are false.
//    4. Two objects are strictly equal if they refer to the same Object.
//    5. Null and Undefined types are not equal with ===, but equal with == .
//       i.e, `null===undefined --> false`, but `null==undefined --> true`

//    Some of the example which covers the above cases:

   0 == false   // true
   0 === false  // false
   1 == "1"     // true
   1 === "1"    // false
   null == undefined // true
   null === undefined // false
   '0' == false // true
   '0' === false // false
   NaN == NaN or NaN === NaN // false
//    []==[] or []===[] //false, refer different objects in memory
//    {}=={} or {}==={} //false, refer different objects in memory


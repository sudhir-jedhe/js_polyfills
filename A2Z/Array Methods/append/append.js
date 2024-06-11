
const arr = [3, 4];
// atEnd
arr.push(5) //  [3,4,5]

// atStart
arr.unshift(2)



const arr2 = [1, 2, 3];
const otherArr = [4, 5, 6];
arr2.push(...otherArr); // [1, 2, 3, 4, 5, 6]
arr2.unshift(...otherArr); // [4, 5, 6, 1, 2, 3, 4, 5, 6]
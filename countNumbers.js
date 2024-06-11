function countNumbers(collection) {
    // write your solution below
    let count = 0;
  
    if (!collection.length) {
      return count;
    }
  
    // do some processing
    // [1,2,3,4]
    // [1,[2]]
  
    for (let i = 0; i < collection.length; i++) {
      // 1
      // [2]
      // 2
      const current = collection[i];
  
      if (typeof current === "number") {
        // count += 1 => 0 + 1
        // count = 1
        count += 1;
      } else if (Array.isArray(current)) {
        // count += countNumber([2]) => 1
        // count = 1 + 1;
        // count = 2;
        count += countNumbers(current);
      }
    }
    // 1
    // 2
    return count;

}

countNumbers([ 1,"2", [3,4,[5]], function(){}, 8, 9 ]);
// 6

countNumbers([]);
// 0
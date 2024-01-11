// This is a JavaScript Quiz from BFE.dev

Promise.resolve(1) // 1 promise fullfilled 1 pass to then
  .then((val) => {
    console.log(val); // 1
    return val + 1; // 2  (1 + 1)
  })
  .then((val) => {
    //
    console.log(val); // 2. but not return. so next then will received undefined
  })
  .then((val) => {
    console.log(val); // undefined
    return Promise.resolve(3).then((val) => {
      // returning 3 to next then as promise returning
      console.log(val); // 3
    });
    // but not return. so next then will received undefined
  })
  .then((val) => {
    // undefined
    console.log(val);
    return Promise.reject(4); // reject promises return 4 then go to catch
  })
  .catch((val) => {
    // 4
    console.log(val);
    // not return undefined next then will received undefined
  })
  .finally((val) => {
    // finally never accept parameter
    // undefined
    console.log(val);
    return 10; // finally never return
  })
  .then((val) => {
    // it will check value receive before finally
    console.log(val); // undefined
  });

// 1 2 undefined 3 undefined 4 undefined undefined

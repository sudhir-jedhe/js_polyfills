Promise.resolve(1)
  .then(() => 2) // not utilise value 1 from resolve. so return 2
  .then(3) // not utilize call back then value is no use.
  .then((value) => value * 3) // 2  so utilize previous/last return value from then
  .then(Promise.resolve(4)) // pass 2 * 3 = 6, but not utilize the call back, not return any thing . no use. So 6 passe to next then
  .then(console.log); // 6 (value) => console.log(value)

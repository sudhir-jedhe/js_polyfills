const work = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("doing work"), 3000);
  });
};

const doWork = async () => {
  console.log(await work());
};

console.log("before");
doWork();
console.log("after");
/*  before
      after
      doing work
  */

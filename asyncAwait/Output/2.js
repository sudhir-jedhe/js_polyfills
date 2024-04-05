const work = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("doing work"), 3000);
  });
};

console.log("before");

work().then((e) => {
  console.log(e);
  console.log("finished");
});

console.log("after");

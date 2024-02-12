const p1 = new Promise((resolve) => setTimeout(resolve, 100, 100));
const p2 = new Promise((resolve) => setTimeout(resolve, 300, 200));
const p3 = new Promise((resolve) => setTimeout(resolve, 500, 300));

const promises = [p1, p2, p3];

Promise.all(promises).then((data) =>
  console.log(data.reduce((total, next) => total + next))
);

console.log("finished");

// This is a JavaScript Quiz from BFE.dev

let func = () => {
  console.log(1);
};
setTimeout(() => {
  func = () => {
    console.log(2);
  };
}, 0);

setTimeout(func, 100);

/**************************** */

let num;

for (let i = 0; i < 5; i++) {
  num = i;
  setTimeout(() => {
    console.log(num);
  }, 100);
}

// 4

/************************************************** */
// This is a JavaScript Quiz from BFE.dev

// This snippet's result may vary on browsers

setTimeout(() => {
  console.log(2);
}, 2);

setTimeout(() => {
  console.log(1);
}, 1);

setTimeout(() => {
  console.log(0);
}, 0);

//Promise.reject
let promise = new Promise((resolve, reject) => {

    let b = Math.random() < 0.3;

    if (b) {
        resolve(10);
    } else {
        reject("promise error");
    }
});

promise.then(val => console.log(val)).catch(err => {
    console.log(`${err}`)
});

console.log('finished');
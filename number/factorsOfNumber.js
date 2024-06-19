let fact = (n) =>
    [...Array(n + 1).keys()]
    .filter(
        (i) => n % i === 0
    );
console.log(fact(12));


let n = 12;
let i = 1;
for (i = 1; i < n; i++) {
    if (n % i == 0) {
        console.log(i);
    }
}
console.log(n);


let n = 12;
[...Array(n + 1).keys()].reduce(
    (_, i) => {
        if (i !== 0 && n % i === 0) {
            console.log(i);
        }
    }
);


let n = 12;
let fact = [...Array(n + 1).keys()]
    .map((i) => {
        if (n % i === 0) {
            return i;
        }
    })
    .filter((i) => i !== undefined);
console.log(fact);

let n = 12;
let i = 1;
let factors = [];

while (i <= n) {
    if (n % i === 0) {
        factors.push(i);
    }
    i++;
}

console.log(factors);

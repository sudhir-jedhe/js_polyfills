function isPositive(e) {
    return e > 0;
}

let vals = [-2, -3, 0, 4, 3, -1, 1, 7];

let res = vals.find(isPositive);
console.log(res);

let res2 = vals.find(e => e > 0);
console.log(res2);

/**************************** */

let vals = [-2, -3, 0, 4, 3, -1, 1, 7];

let pos = vals.filter(e => e > 0);
console.log(pos);

let neg = vals.filter(e => e < 0);
console.log(neg);

let evs = vals.filter(e => e % 2 === 0);
console.log(evs);


/****************************************************** */

let vals = [-2, -3, 0, 4, 3, -1, 1, 7];

if (vals.every(e => e > 0)) {
    console.log('all values are positive');
} else {
    console.log('not all values are positive');
}

if (vals.some(e => e > 0)) {
    console.log('at least one value is positive');
} else {
    console.log('no value is positive');
}


/****************************************************************** */
function negate(other) {
    return e => { return !other(e) };
};

let vals = [-2, -3, 0, 4, 3, -1, 1, 7];

let res = vals.filter(negate(e => e > 0));
console.log(res);

let res2 = vals.filter(negate(negate(e => e > 0)));
console.log(res2);
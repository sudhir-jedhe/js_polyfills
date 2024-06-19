function sumOfDigit(num) {
    return num.toString().split("")
        .reduce((sum, digit) =>
            sum + parseInt(digit), 0);
}

console.log(sumOfDigit(738));


function sumOfDigit(num) {
    let numStr = num.toString();
    let sum = 0;

    for (let digit of numStr) {
        sum += parseInt(digit);
    }

    return sum;
}

console.log(sumOfDigit(738)); 


function sumOfDigits(num) {
    let sum = 0;
    for (; num > 0; num = Math.floor(num / 10)) {
        sum += num % 10;
    }
    return sum;
}

console.log(sumOfDigits(456));


function sumOfDigit(num) {
    let sum = 0;
    num.toString().split("").forEach(digit => {
        sum += parseInt(digit);
    });
    return sum;
}

console.log(sumOfDigit(123));


function recursiveSum(num) {
    if (num === 0) {
        return 0;
    }
    return (num % 10) + recursiveSum(Math.floor(num / 10));
}

console.log(recursiveSum(738));

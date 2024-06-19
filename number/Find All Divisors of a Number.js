function prime(n) {
  let result = [1, n];
  for (let i = 2; i < Math.pow(n, 0.5); i++) {
    if (n % i == 0) {
      result.push(i);
      result.push(n / i);
    }
  }
  return result.sort((a, b) => a - b);
}

const num = 90;
console.log("Prime factors of " + num + ": " + prime(num));

function recursiveFactor(n, d) {
  if (n < 1) return [];
  if (n == 1) return [1];
  if (n == 2) return [1, 2];
  if (n / d < 2) return [n];
  if (n % d == 0) return [d, ...recursiveFactor(n, d + 1)];
  return recursiveFactor(n, d + 1);
}

const num = 85;
console.log("All factors of " + num + ": " + recursiveFactor(num, 1));

function optimizedDivisors(n) {
  let result = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i == 0) {
      result.push(i);
      if (i !== n / i) {
        result.push(n / i);
      }
    }
  }
  return result.sort((a, b) => a - b);
}

const num = 90;
console.log("All divisors of " + num + ": " + optimizedDivisors(num));

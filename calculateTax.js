function calculateTax(brackets, income) {
  let totalTax = 0;
  let remainingIncome = income;

  for (let i = 0; i < brackets.length; i++) {
    const [upperBound, taxRate] = brackets[i];
    if (remainingIncome <= 0) break;

    const taxableIncome = Math.min(remainingIncome, upperBound);
    const taxForBracket = (taxableIncome * taxRate) / 100;
    totalTax += taxForBracket;
    remainingIncome -= taxableIncome;
  }

  return totalTax;
}

const brackets = [
  [10000, 10], // 10% tax on income up to $10,000
  [20000, 20], // 20% tax on income between $10,001 and $20,000
  [30000, 30], // 30% tax on income between $20,001 and $30,000
];

const income = 25000; // Income for calculation

console.log(calculateTax(brackets, income)); // Output: 3000 (10% of $10,000 + 20% of $10,000 + 30% of $5,000)

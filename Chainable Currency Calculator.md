A **Chainable Currency Calculator** is a popular JavaScript interview question that tests:

* Closures
* Method chaining
* Fluent API design
* Object-oriented JavaScript
* Function currying (advanced version)

***

# Expected Usage

```js
const result = Currency(100)
  .add(50)
  .subtract(20)
  .multiply(2)
  .divide(5)
  .value();

console.log(result); // 52
```

***

# Solution 1: Closure-Based Implementation

```js
function Currency(initialAmount = 0) {
  let amount = initialAmount;

  return {
    add(value) {
      amount += value;
      return this;
    },

    subtract(value) {
      amount -= value;
      return this;
    },

    multiply(value) {
      amount *= value;
      return this;
    },

    divide(value) {
      if (value === 0) {
        throw new Error("Cannot divide by zero");
      }

      amount /= value;
      return this;
    },

    value() {
      return amount;
    }
  };
}
```

### Usage

```js
const total = Currency(100)
  .add(50)
  .subtract(10)
  .multiply(2)
  .divide(4)
  .value();

console.log(total);
```

Output:

```js
70
```

Calculation:

```text
100 + 50 = 150
150 - 10 = 140
140 * 2 = 280
280 / 4 = 70
```

***

# Solution 2: Class-Based Implementation

This is often preferred in enterprise applications.

```js
class CurrencyCalculator {
  constructor(amount = 0) {
    this.amount = amount;
  }

  add(value) {
    this.amount += value;
    return this;
  }

  subtract(value) {
    this.amount -= value;
    return this;
  }

  multiply(value) {
    this.amount *= value;
    return this;
  }

  divide(value) {
    if (value === 0) {
      throw new Error("Division by zero");
    }

    this.amount /= value;
    return this;
  }

  value() {
    return this.amount;
  }
}
```

### Usage

```js
const result = new CurrencyCalculator(100)
  .add(50)
  .subtract(20)
  .multiply(2)
  .divide(5)
  .value();

console.log(result); // 52
```

***

# Advanced Currency Support

Interviewers often extend the question:

```js
Currency(100, "USD")
  .add(50)
  .convert("INR")
  .value();
```

***

### Example

```js
const rates = {
  USD: 1,
  INR: 83,
  EUR: 0.92
};

class CurrencyCalculator {
  constructor(amount, currency = "USD") {
    this.amount = amount;
    this.currency = currency;
  }

  add(value) {
    this.amount += value;
    return this;
  }

  subtract(value) {
    this.amount -= value;
    return this;
  }

  convert(toCurrency) {
    const usdAmount =
      this.amount / rates[this.currency];

    this.amount =
      usdAmount * rates[toCurrency];

    this.currency = toCurrency;

    return this;
  }

  value() {
    return {
      amount: Number(this.amount.toFixed(2)),
      currency: this.currency,
    };
  }
}
```

### Usage

```js
const result = new CurrencyCalculator(
  100,
  "USD"
)
  .add(50)
  .convert("INR")
  .value();

console.log(result);
```

Output:

```js
{
  amount: 12450,
  currency: "INR"
}
```

***

# TypeScript Version

```ts
class CurrencyCalculator {
  private amount: number;

  constructor(amount = 0) {
    this.amount = amount;
  }

  add(value: number): this {
    this.amount += value;
    return this;
  }

  subtract(value: number): this {
    this.amount -= value;
    return this;
  }

  multiply(value: number): this {
    this.amount *= value;
    return this;
  }

  divide(value: number): this {
    if (value === 0) {
      throw new Error("Division by zero");
    }

    this.amount /= value;
    return this;
  }

  value(): number {
    return this.amount;
  }
}
```

***

# Interview Follow-Up: Immutable Version

Instead of mutating state:

```js
Currency(100)
  .add(20)
  .add(30);
```

each operation returns a new instance.

```js
class Currency {
  constructor(amount) {
    this.amount = amount;
  }

  add(value) {
    return new Currency(
      this.amount + value
    );
  }

  subtract(value) {
    return new Currency(
      this.amount - value
    );
  }

  value() {
    return this.amount;
  }
}
```

This follows the same principle as:

* Redux reducers
* Functional programming
* React state immutability

***

# Senior Frontend Interview Talking Points

Explain that the chainable API works because:

```js
return this;
```

returns the current instance, allowing the next method in the chain to execute.

```js
calculator
  .add(10)
  .subtract(5)
  .multiply(2);
```

is internally equivalent to:

```js
calculator.add(10);
calculator.subtract(5);
calculator.multiply(2);
```

but provides a more readable **fluent interface**, similar to:

* Jest (`expect().toBe()`)
* Cypress (`cy.get().click()`)
* Lodash (`_.chain()`)
* Playwright (`page.locator().click()`)

This is usually the level of explanation expected in a Senior React/JavaScript interview.

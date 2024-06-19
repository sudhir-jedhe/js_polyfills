const isoCodes = Intl.supportedValuesOf('currency');

const currencyFields = ['symbol', 'narrowSymbol', 'name'];

const allCurrencies = new Map(
  isoCodes.map(code => {
    const format = currencyDisplay => value =>
      Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: code,
        currencyDisplay,
      })
        .format(value)
        .trim();
    return [code, Object.freeze({ code, format })];
  })
);

const getCurrencyFromCode = code => {
  const isoCode = code.toUpperCase();
  return allCurrencies.get(isoCode);
};

class Currency {
  static get(code) {
    const currency = getCurrencyFromCode(code);
    if (!currency)
      throw new RangeError(`Invalid currency ISO code "${code}"`);
    return currency;
  }

  static wrap(currency) {
    if (
      typeof currency === 'object' &&
      getCurrencyFromCode(currency.code) === currency
    )
      return currency;

    return Currency.get(currency);
  }
}
class Bank {
  static defaultBank;

  exchangeRates;

  constructor() {
    this.exchangeRates = new Map();
  }

  setRate(from, to, rate) {
    const fromCurrency = Currency.wrap(from);
    const toCurrency = Currency.wrap(to);
    const exchangeRate = Number.parseFloat(rate);

    this.exchangeRates.set(
      `${fromCurrency.code} -> ${toCurrency.code}`,
      exchangeRate
    );

    return this;
  }

  getRate(from, to) {
    const fromCurrency = Currency.wrap(from);
    const toCurrency = Currency.wrap(to);

    return this.exchangeRates.get(
      `${fromCurrency.code} -> ${toCurrency.code}`
    );
  }

  exchange(money, to) {
    if (!(money instanceof Money))
      throw new TypeError(`#{money} is not an instance of Money`);

    const toCurrency = Currency.wrap(to);
    if (toCurrency === money.currency) return money;

    const exchangeRate = this.getRate(money.currency, toCurrency);
    if (!exchangeRate)
      throw new TypeError(
        `No exchange rate found for ${money.currency.code} to ${toCurrency.code}`
      );
    return new Money(money.value * exchangeRate, toCurrency);
  }
}
class Money {
  value;
  currency;
  bank;

  constructor(value, currency, bank = Bank.defaultBank) {
    this.value = Number.parseFloat(value);
    this.currency = Currency.wrap(currency);
    if (!(bank instanceof Bank))
      throw new TypeError(`#{bank} is not an instance of Bank`);
    this.bank = bank;
  }

  format(currencyDisplay = 'symbol') {
    return this.currency.format(currencyDisplay)(this.value);
  }

  exchangeTo(currency) {
    return this.bank.exchange(this, currency);
  }

  add(money) {
    if (this.currency !== money.currency)
      money = money.exchangeTo(this.currency);
    return new Money(this.value + money.value, this.currency);
  }

  subtract(money) {
    if (this.currency !== money.currency)
      money = money.exchangeTo(this.currency);
    return new Money(this.value - money.value, this.currency);
  }

  multiply(num) {
    return new Money(this.value * num, this.currency);
  }

  divide(num) {
    return new Money(this.value / num, this.currency);
  }

  div(num) {
    return new Money(Math.floor(this.value / num), this.currency);
  }

  mod(num) {
    return new Money(this.value % num, this.currency);
  }

  divmod(num) {
    return [this.div(num), this.mod(num)];
  }

  equals(money) {
    if (this.currency !== money.currency)
      money = money.exchangeTo(this.currency);
    return this.value === money.value;
  }

  greaterThan(money) {
    if (this.currency !== money.currency)
      money = money.exchangeTo(this.currency);
    return this.value > money.value;
  }

  lessThan(money) {
    if (this.currency !== money.currency)
      money = money.exchangeTo(this.currency);
    return this.value < money.value;
  }
}
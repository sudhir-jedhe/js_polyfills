/**************Currency Formating *****************/
function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
    if (typeof amount !== 'number') {
        throw new Error('Amount must be a number.');
    }
  
    const formattedAmount = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amount);
  
    return formattedAmount;
  }
  
  // Example usage:
  const price = 12345.6789;
  const formattedPrice = formatCurrency(price, 'USD', 'en-US');
  
  console.log(formattedPrice);
  // Output: $12,345.68
const product = {
    name: 'Wireless Headphones',
    stock: 0,
   };
   
   const productName = product.name ?? 'Unknown product'; // 'Wireless Headphones'
   const productStock = product.stock ?? 'Out of stock'; // 0
   
   const productNameOr = product.name || 'Unknown product'; // 'Wireless Headphones'
   const productStockOr = product.stock || 'Out of stock'; // 'Out of stock'
   
   console.log(productName, productNameOr); // 'Wireless Headphones', 'Wireless Headphones'
   
   console.log(productStock, productStockOr); // 0, 'Out of stock'

//    𝗜𝗻 𝘁𝗵𝗲 𝗲𝘅𝗽𝗿𝗲𝘀𝘀𝗶𝗼𝗻 𝘅 ?? 𝘆,

// → 𝗜𝗳 𝘅 𝗶𝘀 𝗲𝗶𝘁𝗵𝗲𝗿 𝗻𝘂𝗹𝗹 𝗼𝗿 𝘂𝗻𝗱𝗲𝗳𝗶𝗻𝗲𝗱 𝘁𝗵𝗲𝗻 𝗼𝗻𝗹𝘆 𝗿𝗲𝘀𝘂𝗹𝘁 𝘄𝗶𝗹𝗹 𝗯𝗲 𝘆.
// → 𝗜𝗳 𝘅 𝗶𝘀 𝗻𝗼𝘁 𝗻𝘂𝗹𝗹 𝗼𝗿 𝘂𝗻𝗱𝗲𝗳𝗶𝗻𝗲𝗱 𝘁𝗵𝗲𝗻 𝘁𝗵𝗲 𝗿𝗲𝘀𝘂𝗹𝘁 𝘄𝗶𝗹𝗹 𝗯𝗲 𝘅.

// The nullish coalescing operator (??) specifically checks for null or undefined, while the logical OR operator (||) checks for any falsy value (null, undefined, false, 0, NaN, "", etc.)

// The logical operator always returns the first truthy value.

// 𝗜𝗳 𝗮 𝘃𝗮𝗿𝗶𝗮𝗯𝗹𝗲 𝗺𝗶𝗴𝗵𝘁 𝗰𝗼𝗻𝘁𝗮𝗶𝗻 𝘃𝗮𝗹𝗶𝗱 𝗳𝗮𝗹𝘀𝘆 𝘃𝗮𝗹𝘂𝗲𝘀 𝘁𝗵𝗮𝘁 𝘆𝗼𝘂 𝗱𝗼𝗻'𝘁 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗼𝘃𝗲𝗿𝗿𝗶𝗱𝗲, 𝘁𝗵𝗲𝗻 𝘂𝘀𝗶𝗻𝗴 ?? 𝗶𝘀 𝘁𝗵𝗲 𝗯𝗲𝘁𝘁𝗲𝗿 𝗰𝗵𝗼𝗶𝗰𝗲.

let result = undefined ?? "Hello";
console.log(result); // Hello

result = null ?? true; 
console.log(result); // true

result = false ?? true;
console.log(result); // false

result = 45 ?? true; 
console.log(result); // 45

result = "" ?? true; 
console.log(result); // ""

result = NaN ?? true; 
console.log(result); // NaN

result = 4 > 5 ?? true; 
console.log(result); // false because 4 > 5 evaluates to false

result = 4 < 5 ?? true;
console.log(result); // true because 4 < 5 evaluates to true

result = [1, 2, 3] ?? true;
console.log(result); // [1, 2, 3]
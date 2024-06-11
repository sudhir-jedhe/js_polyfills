function romanToInteger(str) {
    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    let result = 0;

    for (let i = 0; i < str.length; i++) {
        const currentValue = romanValues[str[i]];
        const nextValue = romanValues[str[i + 1]];

        if (nextValue && currentValue < nextValue) {
            result += nextValue - currentValue; // Subtract if the next value is greater
            i++; // Skip the next character
        } else {
            result += currentValue; // Add current value
        }
    }

    return result;
}

// Example usage:
// const result = romanToInteger('MCMXCIV');
// console.log(result); // Output: 1994 (M = 1000, CM = 900, XC = 90, IV = 4)

function countMatches(items, ruleKey, ruleValue) {
    let count = 0;

    for (const item of items) {
        const [type, color, name] = item;

        if ((ruleKey === 'type' && type === ruleValue) ||
            (ruleKey === 'color' && color === ruleValue) ||
            (ruleKey === 'name' && name === ruleValue)) {
            count++;
        }
    }

    return count;
}

// Test cases
console.log(countMatches([["phone","blue","pixel"],["computer","silver","lenovo"],["phone","gold","iphone"]], "color", "silver")); // Output: 1
console.log(countMatches([["phone","blue","pixel"],["computer","silver","phone"],["phone","gold","iphone"]], "type", "phone")); // Output: 2

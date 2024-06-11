function firstBadVersion(isBad) {
    let left = 1;
    let right = Infinity;

    while (left < right) {
        const mid = Math.floor(left + (right - left) / 2);
        if (isBad(mid)) {
            right = mid; // If current version is bad, search in the left half
        } else {
            left = mid + 1; // If current version is good, search in the right half
        }
    }

    return left; // Return the first bad version
}

// Example usage:
// const isBad = version => version >= 4; // Example isBad function
// const firstBad = firstBadVersion(isBad);
// console.log(firstBad); // Output: 4 (the first bad version)

function findContentChildren(g, s) {
  // Sort the greed factor array and the cookie sizes array
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let contentChildren = 0;
  let cookieIndex = 0;

  // Iterate over the sorted arrays and assign cookies to children
  for (let i = 0; i < g.length; i++) {
    while (cookieIndex < s.length && s[cookieIndex] < g[i]) {
      // Find the smallest cookie size that satisfies the current child's greed factor
      cookieIndex++;
    }
    if (cookieIndex < s.length) {
      // Assign the cookie to the child and increment the content children count
      contentChildren++;
      cookieIndex++;
    } else {
      // No more cookies available to satisfy the remaining children
      break;
    }
  }

  return contentChildren;
}

console.log(findContentChildren([1, 2, 3], [1, 1])); // Output: 1
console.log(findContentChildren([1, 2], [1, 2, 3])); // Output: 2

// , you will implement a function to assign cookies to children based on their
// greed factor. You are an awesome parent and want to give your children some
// cookies. But, you should give each child at most one cookie.

// Each child i has a greed factor g[i], which is the minimum size of a cookie
// that the child will be content with; and each cookie j has a size s[j]. If
// s[j] >= g[i], we can assign the cookie j to the child i, and the child i will
// be content. Your goal is to maximize the number of your content children and
// output the maximum number.

// xample 1:
// Input: g = [1,2,3], s = [1,1]
// Output: 1
// Explanation: You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3. And even though you have 2 cookies, since their size is both 1, you could only make the child whose greed factor is 1 content. You need to output 1.

// Example 2:
// Input: g = [1,2], s = [1,2,3]
// Output: 2
// Explanation: You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2. You have 3 cookies and their sizes are big enough to gratify all of the children, You need to output 2.

// Example 3:
// Input: g = [10,9,8], s = [5,6,7]
// Output: 0
// Explanation: You have 3 children and their greed factors are 10, 9, and 8. However, you only have 3 cookies with sizes 5, 6, and 7. None of the cookies are large enough to satisfy any of the children. You need to output 0.

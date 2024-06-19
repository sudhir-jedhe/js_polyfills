function maxArea(height) {
    let maxArea = 0;
    let left = 0;
    let right = height.length - 1;

    while (left < right) {
        // Calculate the current area
        let currentArea = (right - left) * Math.min(height[left], height[right]);
        // Update maxArea if currentArea is greater
        maxArea = Math.max(maxArea, currentArea);
        
        // Move the pointer pointing to the smaller height inward
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}

// Example usage:
const height = [1, 5, 4, 3];
console.log(maxArea(height)); // Output: 6


// Input: array = [1, 5, 4, 3]
// Output: 6
// Explanation : 
// 5 and 3 are distance 2 apart. 
// So the size of the base = 2. 
// Height of container = min(5, 3) = 3. 
// So total area = 3 * 2 = 6

<script>
	// Javascript code for Max
	// Water Container
	
	function maxArea(A, len)
	{
		let area = 0;
		for (let i = 0; i < len; i++) {
			for (let j = i + 1; j < len; j++) {
				// Calculating the max area
				area = Math.max(area, Math.min(A[j], A[i]) * (j - i));
			}
		}
		return area;
	}

	let a = [ 1, 5, 4, 3 ];
	let b = [ 3, 1, 2, 4, 5 ];

	let len1 = a.length;
	document.write(maxArea(a, len1) + "</br>");

	let len2 = b.length;
	document.write(maxArea(b, len2));
	
	// This code is contributed by mukesh07.
</script>


<script>

// Javascript code for Max
// Water Container
function maxArea(A, len)
{
	let l = 0;
	let r = len -1;
	let area = 0;

	while (l < r)
	{
		
		// Calculating the max area
		area = Math.max(area, Math.min(A[l],
						A[r]) * (r - l));
		
		if (A[l] < A[r])
			l += 1;
		else
			r -= 1;
	}
	return area;
}

// Driver code 
let a = [ 1, 5, 4, 3 ];
let b = [ 3, 1, 2, 4, 5 ];

let len1 = a.length;
document.write(maxArea(a, len1) + "</br>");

let len2 = b.length;
document.write(maxArea(b, len2));

// This code is contributed by rameshtravel07

</script>


var maxArea = function(H) {
    let ans = 0, i = 0, j = H.length-1
    while (i < j) {
        ans = Math.max(ans, Math.min(H[i], H[j]) * (j - i))
        H[i] <= H[j] ? i++ : j--
    }
    return ans
};


// Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.
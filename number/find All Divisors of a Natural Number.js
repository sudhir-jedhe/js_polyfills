const findDivisors = () => { 
	const divisors = []; 
	for (let i = 1; i <= n; i++) { 
		if (n % i === 0) { 
			divisors.push(i); 
		} 
	} 
	return divisors; 
}; 

let n = 14; 
console.log(findDivisors(n));
// [ 1, 2, 7, 14 ]



const findDivisors = () => { 
	const divisors = []; 
	for (let i = 1; i * i <= n; i++) { 
		if (n % i === 0) { 
			divisors.push(i); 
			if (i !== n / i) { 
				divisors.push(n / i); 
			} 
		} 
	} 
	return divisors; 
}; 

let n = 12; 
console.log(findDivisors(n));

// [ 1, 12, 2, 6, 3, 4 ]
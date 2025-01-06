// Input:
//         1    2   3   4
//         5    6   7   8
//         9   10  11  12
//         13  14  15  16
// Output:
// 10 11 7 6 5 9 13 14 15 16 12 8 4 3 2 1
// Input:
//         1   2   3   4  5   6
//         7   8   9  10  11  12
//         13  14  15 16  17  18
// Output:
// 11 10 9 8 7 13 14 15 16 17 18 12 6 5 4 3 2 1

// This is a modified code of
// https://www.geeksforgeeks.org/
// print-a-given-matrix-in-spiral-form/

let R = 3;
let C = 6;

// Function that print matrix in
// reverse spiral form.
function ReversespiralPrint(m, n, a) {
  // Large array to initialize it
  // with elements of matrix
  let b = new Array(100);

  /* k - starting row index 
	l - starting column index*/
  let i,
    k = 0,
    l = 0;

  // Counter for single dimension array
  //in which elements will be stored
  let z = 0;

  // Total elements in matrix
  let size = m * n;

  while (k < m && l < n) {
    // Variable to store value of matrix.
    let val;

    /* Print the first row from 
		the remaining rows */
    for (i = l; i < n; ++i) {
      // printf("%d ", a[k][i]);
      val = a[k][i];
      b[z] = val;
      ++z;
    }
    k++;

    /* Print the last column from 
		the remaining columns */
    for (i = k; i < m; ++i) {
      // printf("%d ", a[i][n-1]);
      val = a[i][n - 1];
      b[z] = val;
      ++z;
    }
    n--;

    /* Print the last row from the 
		remaining rows */
    if (k < m) {
      for (i = n - 1; i >= l; --i) {
        // printf("%d ", a[m-1][i]);
        val = a[m - 1][i];
        b[z] = val;
        ++z;
      }
      m--;
    }

    /* Print the first column from the 
		remaining columns */
    if (l < n) {
      for (i = m - 1; i >= k; --i) {
        // printf("%d ", a[i][l]);
        val = a[i][l];
        b[z] = val;
        ++z;
      }
      l++;
    }
  }
  for (let i = size - 1; i >= 0; --i) {
    document.write(b[i] + " ");
  }
}

/* Driver program to test above functions */
let a = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18],
];
ReversespiralPrint(R, C, a);

const A = ["A", "B", "C", "D", "E", "F"];
const B = [1, 5, 4, 3, 2, 0];

// You need to reorder A, so that the A[i] is put at index of B[i],
// which means B is the new index for each item of A.

// For above example A should be modified inline to following

// ['F', 'A', 'E', 'D', 'C', 'B']

/**
 * @param {any[]} items
 * @param {number[]} newOrder
 * @return {void}
 */
function sort(items, newOrder) {
  for (let i = 0; i < newOrder.length; i++) {
    while (newOrder[i] !== i) {
      swap(items, i, newOrder[i]);
      swap(newOrder, i, newOrder[i]);
    }
  }
}

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

/************************************* */
/**
 * @param {any[]} items
 * @param {number[]} newOrder
 * @return {void}
 */
function sort(items, newOrder) {
  // reorder items inline
  items.sort(function (a, b) {
    let x = items.indexOf(a);
    let y = items.indexOf(b);
    return newOrder[x] - newOrder[y];
  });
}

/*************************** */

/**
 * @param {any[]} items
 * @param {number[]} newOrder
 * @return {void}
 */
function sort(items, newOrder) {
  // swap pairs until you finish processing the array
  for (let i = 0; i < newOrder.length; i++) {
    const indexToPut = newOrder[i];
    const val = items[i];
    const temp = items[indexToPut];
    items[indexToPut] = val;
    items[i] = temp;

    const tempTwo = newOrder[i];
    newOrder[i] = newOrder[indexToPut];
    newOrder[indexToPut] = tempTwo;
  }
  return items;
}

const A = ["A", "B", "C", "D", "E", "F"];
const B = [1, 5, 4, 3, 2, 0];

// console.log(sort(A,B));

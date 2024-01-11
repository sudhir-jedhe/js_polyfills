function bsearch(arr, l, r, x) {
    if (r >= l) {
        let mid = l + Math.floor((r - l) / 2);
 
        if (arr[mid] == x)
            return mid;
 
        if (arr[mid] > x)
            return bsearch(arr, l, mid - 1, x);
 
        return bsearch(arr, mid + 1, r, x);
    }
 
    return -1;
 
}
 
let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
// To check if 85 is present or not
console.log("Is 85 present? " + (bsearch(num, 0, num.length, 85) != -1));
 
// To check if 1 is present or not
console.log("Is 1 present? " + (bsearch(num, 0, num.length, 1) != -1));
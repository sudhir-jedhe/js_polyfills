A Collatz sequence is obtained by performing the following operations on any given number.

If the number is even then number = number / 2.
If the number is odd then number = 3 * number + 1.
Repeat this steps until the number becomes 1.


n = 6
6, 3, 10, 5, 16, 8, 4, 2, 1


let collatz = (num) => {
    // loop till the given num is not 1
    while(num != 1){

      //print the num
      console.log(num);

      //if the number is even
      if(num % 2 == 0){

        num = parseInt(num / 2); 

      }else{
        //if the number is odd
        num = (num * 3) + 1;
      }
    }

  // print the last number
  console.log(num);
}


/******************** */


let collatzTail = (num, store) => {
    //if num is 1 then store 1
    if(num === 1) { 
        store.push(1);
        return store;

    //if num is even then store num / 2
    } else if(num % 2 === 0) {
        store.push(num); 
        return collatzTail(parseInt(num / 2), store);
      //if num is odd then store num * 3 + 1

    } else {
        store.push(num); 
        return collatzTail(3 * num + 1, store);
    }
};
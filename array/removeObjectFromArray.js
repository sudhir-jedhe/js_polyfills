let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

delete arr[4];

console.log(arr);
//[123, 'Prashant Yadav', 'India', null, undefined, {'pqr': 'stu'}];



let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

arr.splice(4, 1);

console.log(arr);
//[123, 'Prashant Yadav', 'India', null, {'pqr': 'stu'}];



let filterObjects = (key, value) => {
    //Filter array based on the key and value
    return arr.filter((e) => {
      //Check if the current element is of object type
      //And has the key
      if(e && e.hasOwnProperty(key) && e[key] === value){
        return false;
      }
  
      return true;
    });
  };


  let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

console.log(filterObjects('pqr','stu'));
//[123, 'Prashant Yadav', 'India', null, {'abc': 'xyz'}]
/ This is a JavaScript coding problem from BFE.dev 
/**
 * @param {Array<any>} list
 * @returns {void}
 */
function moveZeros(list) {
  let index = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] != 0)
      list[index++] = list[i];
  }
  for (let i = index; i < list.length; i++)
    list[i] = 0;
  return list;
}



/**************************** */


function moveZeros(list) {
    list.sort((a, b) =>  {
      if (a === 0) {
        return 1;
      } 
      if (b === 0) {
        return -1;
      }
      return 0;
    });
  }
  const list = [0,1,0,3,2,6] 
  moveZeros(list) 
  console.log(list) //  [1,2,3,6,0,0,0] 

  /******************************* */


  function moveZeros(list) {
    // your code here
    let start = 0;
    for (let index = 0; index < list.length; index++) if (list[index] !== 0) [list[start++], list[index]] = [list[index], list[start]]
  }

  
  function moveZeros(list) {
    for (let i = 0, lastNonZeroFoundAt = 0; i < list.length; i++) {
      if (list[i] !== 0) {
        [list[lastNonZeroFoundAt], list[i]] = [list[i], list[lastNonZeroFoundAt]];
        lastNonZeroFoundAt++;
      }
    }
  }
  


  function moveZeros(list) {
    for(let i=0; i<list.length; i++){
      if(list[i] === 0){
        let j = i+1;
        while(j < list.length){
          if(list[j] !== 0){
            [list[j], list[i]] = [list[i], list[j]]
            break;
          }
          j++
        }
      }
    }
    return list
  }
  
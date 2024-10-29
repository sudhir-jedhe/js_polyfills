/**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE FUNCTION NAME

function isNumeric(val){
    return /^\d+$/.test(val)
  }
  
  function maskify(cardNumber) {
    if(typeof cardNumber !== 'string' && typeof cardNumber !== 'number'){
      return ''
    }
  
    cardNumber = cardNumber.toString()
    const n = cardNumber.length
  
    if(n <= 6){
      return cardNumber
    }
  
    let maskedNumber = ''
  
    for(let i=0; i < n; i++){
      if (i > 0 && i < n - 4 && isNumeric(cardNumber[i])){
        maskedNumber += '#'
      }else{
        maskedNumber += cardNumber[i]
      }
    }
    return maskedNumber
  };


  /**************************** */

  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE FUNCTION NAME


function isDigit(char){
    return /[0-9]/i.test(char);
  }
  
  function maskify(cardNumber) {
    // write your code below
    let type = typeof cardNumber;
    
    if (!cardNumber || (type !== "string" && type !== "number"))
      return '';
    cardNumber = cardNumber.toString();
  
    if (cardNumber.toString().length < 6) return cardNumber;
  
    let first = cardNumber.slice(0,1);
    let masked = cardNumber.slice(1,cardNumber.length -4).replace(/\d/g,'#');
    let end = cardNumber.slice(-4);
  
    return `${first}${masked}${end}`;
   
  }


  /********************************* */

  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE FUNCTION NAME

function maskify(cardNumber) {
    // write your code below
    if(cardNumber.length < 6) return cardNumber;
    const typeofCardNumber = typeof cardNumber;
    if (typeof cardNumber !== 'string' || typeofCardNumber !== 'number')return cardNumber;
    let maskedCardNumber = cardNumber;
    
    for(let i=0; i <cardNumber.length; i++) {
      if(i === 0 || (cardNumber.length - i - 1) <= 4) {
        maskedCardNumber[i] = '#';
      }
    }
    console.log(maskedCardNumber);
    return maskedCardNumber.toString();
  }


  /************************** */

  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE FUNCTION NAME

function maskify(cardNumber) {
    // write your code below
    if(typeof(cardNumber)!=="string" && typeof(cardNumber)!=="number")
      {
       return '';
      }
      let cardno='';
      if(typeof (cardNumber) =='number'){
          cardno=(String(cardNumber))
      }else{
          cardno=cardNumber
      }
  
       if(cardno.length<=6){
          return cardno;
      }
    else {
      let masked=cardno[0]
      let lastnums=cardno.slice(cardno.length-4,cardno.length)
      for (let i=1;i<cardno.length-4;i++){
          if(isNaN(Number(cardno[i]))===false && cardno[i]!==" "){
           masked+='#'
          }else{
              masked+=cardno[i]
          }
          
      }
      masked+=lastnums
  return masked
  }
  }
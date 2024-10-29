function validateNumberString(str) {
    return str !=="" && !isNaN(str)
  }


  function validateNumberString(str) {
    return /^[+-]?(\d+(\.\d*)?|\d*\.\d+)(e[+-]?\d+)?$/i.test(str)
  }

  function validateNumberString(str) {
    // your code her
    return !isNaN(parseFloat(str)) && isFinite(str) || !isNaN(parseFloat(str)) && str > Number.MAX_VALUE;
  }

  function validateNumberString(str) {
    // your code here
    const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
    return numberRegex.test(str);
  }
  validateNumberString('+100.123444444444e')




  function validateNumberString(str) {
    // your code here
    const unsign_integer = '[1-9][0-9]+|[0-9]';
    const integer = '[+-]?([1-9][0-9]+|[0-9])';
    const deciaml = `${integer}\\.(${unsign_integer})?|[+-]?\\.(${unsign_integer})`;
    const exponent = `(${deciaml})[eE](${integer})|${integer}[eE](${integer})`;
    
    const integerReg = new RegExp(`^(${integer})\$`);
    const deciamlReg = new RegExp(`^(${deciaml})$`);
    const exponentReg = new RegExp(`^(${exponent})$`);
    return integerReg.test(str) || deciamlReg.test(str) || exponentReg.test(str);
  }
  unsign integer(12 , 252, 0, 1, 2,)
  [1-9][0-9]+|[0-9]
  
  sign integer(+12, -4234,-0,-2, +0)
  [+-]?([[1-9][0-9]+|[0-9])
  
  decimal
  -12.242
  -12.
  integer.unsign_integer?
  
  -.122423
  [+-]?.unsign_integer
  
  expoint
  -12.124e123242
  -.24234e122342
  decimal[eE]integer
  
  123253e124234
  integer[eE]integer
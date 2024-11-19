function percentageFormatter(num) {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100);
  }
  
  console.log(percentageFormatter(18.75));
  // 18.75%



  function percentageFormatter(num) {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num / 100);
  }
  
  console.log(percentageFormatter(18.75));
  // 19%


  function percentageFormatter(num) {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  
  console.log(percentageFormatter(0.1875));
  // 18.75%




  function percentageFormatter(num) {
    return `${parseFloat(num).toFixed(2)}%`;
  }
  
  console.log(percentageFormatter(18.75));
  //18.75%
  
  console.log(percentageFormatter(18.7));
  //18.70%
  
  console.log(percentageFormatter(18));
  //18.00%



  function percentageFormatter(num) {
    return `${parseFloat(num * 100).toFixed(2)}%`;
  }
  
  console.log(percentageFormatter(0.1875));
  // "18.75%"
  
  console.log(percentageFormatter(0.187));
  //"18.70%"
  
  console.log(percentageFormatter(0.18));
  // "18.00%"
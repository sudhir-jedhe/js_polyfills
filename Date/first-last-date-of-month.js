const firstDateOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 1);
  
  firstDateOfMonth(new Date('2015-08-11')); // '2015-08-01'


  const lastDateOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  lastDateOfMonth(new Date('2015-08-11')); // '2015-08-31'
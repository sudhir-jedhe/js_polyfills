const daysAgo = n => {
    let d = new Date();
    d.setDate(d.getDate() - Math.abs(n));
    return d;
  };
  
  const daysFromToday = n => {
    let d = new Date();
    d.setDate(d.getDate() + Math.abs(n));
    return d;
  };
  
  daysAgo(20); // 2023-12-17 (if current date is 2024-01-06)
  daysFromToday(20); // 2024-01-26 (if current date is 2024-01-06)
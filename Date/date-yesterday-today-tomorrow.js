const today = () => new Date();

today().toISOString().split('T')[0];
// 2018-10-18 (if current date is 2018-10-18)


const yesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  };
  
  yesterday().toISOString().split('T')[0];
  // 2018-10-17 (if current date is 2018-10-18)

  const tomorrow = () => {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };
  
  tomorrow().toISOString().split('T')[0];
  // 2018-10-19 (if current date is 2018-10-18)
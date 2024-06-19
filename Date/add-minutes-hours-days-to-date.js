const addHoursToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 3_600_000);
    return d;
  };
  
  addHoursToDate('2020-10-19 12:00:00', 10);
  // 2020-10-19 22:00:00
  addHoursToDate('2020-10-19 12:00:00', -10);
  // 2020-10-19 02:00:00


  const addMinutesToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 60_000);
    return d;
  };
  
  addMinutesToDate('2020-10-19 12:00:00', 10);
  // 2020-10-19 12:10:00
  addMinutesToDate('2020-10-19 12:00:00', -10);
  // 2020-10-19 11:50:00


  const addSecondsToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 1000);
    return d;
  };
  
  addSecondsToDate(new Date('2020-10-19 12:00:00'), 10);
  // 2020-10-19 12:00:10
  addSecondsToDate(new Date('2020-10-19 12:00:00'), -10);
  // 2020-10-19 11:59:50


  const addDaysToDate = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  
  addDaysToDate('2020-10-15', 10);
  // 2020-10-25
  addDaysToDate('2020-10-15', -10);
  // 2020-10-05


  const isWeekday = date => date.getDay() % 6 !== 0;

const addWeekDays = (date, n) => {
  const s = Math.sign(n);
  const d = new Date(date);
  return Array.from({ length: Math.abs(n) }).reduce((currentDate) => {
    currentDate = addDaysToDate(currentDate, s);
    while (!isWeekday(currentDate))
      currentDate = addDaysToDate(currentDate, s);
    return currentDate;
  }, d);
};

addWeekDays('2020-10-05', 5);
// 2020-10-12
addWeekDays('2020-10-05', -5);
// 2020-09-28